import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: dto.tenantId },
    });

    if (!tenant) {
      throw new BadRequestException('Tenant não encontrado');
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        username: dto.username,
        tenantId: dto.tenantId,
      },
    });

    if (existingUser) {
      throw new BadRequestException('Usuário já existe');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        password: hashedPassword,
        tenantId: dto.tenantId,
      },
    });

    const token = this.generateTokens(
      user.id,
      user.username,
      user.tenantId,
      user.role,
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: token.refreshToken,
      },
    });

    return {
      id: user.id,
      username: user.username,
      tenantId: user.tenantId,
      role: user.role,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
  }

  async createUserByAdmin(
  adminUserId: number,
  tenantId: number,
  dto: CreateUserDto,
) {
  const admin = await this.prisma.user.findUnique({
    where: { id: adminUserId },
  });

  if (!admin || admin.tenantId !== tenantId) {
    throw new UnauthorizedException('Usuário inválido');
  }

  if (admin.role !== 'ADMIN') {
    throw new UnauthorizedException('Somente ADMIN pode acessar 🚀');
  }

  const existingUser = await this.prisma.user.findFirst({
    where: {
      username: dto.username,
      tenantId,
    },
  });

  if (existingUser) {
    throw new BadRequestException('Usuário já existe');
  }

  const hashedPassword = await bcrypt.hash(dto.password, 10);

  const user = await this.prisma.user.create({
    data: {
      username: dto.username,
      password: hashedPassword,
      tenantId,
      role: dto.role,
    },
    select: {
      id: true,
      username: true,
      role: true,
      tenantId: true,
      createdAt: true,
    },
  });

  return user;
}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        username: dto.username,
        tenantId: dto.tenantId,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const token = this.generateTokens(
      user.id,
      user.username,
      user.tenantId,
      user.role,
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: token.refreshToken,
      },
    });

    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      tenantId: user.tenantId,
      username: user.username,
      role: user.role,
    };
  }

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    const token = this.generateTokens(
      user.id,
      user.username,
      user.tenantId,
      user.role,
    );

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: token.refreshToken,
      },
    });

    return token;
  }

  async findAllByTenant(tenantId: number) {
    return this.prisma.user.findMany({
      where: { tenantId },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        username: 'asc',
      },
    });
  }

  async changePassword(userId: number, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        tenantId: true,
      },
    });
  }

  async adminResetUserPassword(
    adminUserId: number,
    targetUserId: number,
    tenantId: number,
    newPassword: string,
  ) {
    const admin = await this.prisma.user.findUnique({
      where: { id: adminUserId },
    });

    if (!admin || admin.tenantId !== tenantId) {
      throw new UnauthorizedException('Usuário inválido');
    }

    if (admin.role !== 'ADMIN') {
      throw new UnauthorizedException('Somente ADMIN pode acessar 🚀');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser || targetUser.tenantId !== tenantId) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    return this.prisma.user.update({
      where: { id: targetUserId },
      data: {
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        tenantId: true,
        role: true,
      },
    });
  }

  async deleteUser(userId: number, tenantId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.tenantId !== tenantId) {
      throw new BadRequestException('Usuário não encontrado');
    }

    return this.prisma.user.delete({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        tenantId: true,
      },
    });
  }

  private generateTokens(
    userId: number,
    username: string,
    tenantId: number,
    role: string,
  ) {
    const payload = {
      sub: userId,
      username,
      tenantId,
      role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }
}