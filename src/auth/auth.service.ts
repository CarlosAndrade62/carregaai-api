import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
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

    const token = this.generateTokens(user.id, user.username, user.tenantId);

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
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
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

    const token = this.generateTokens(user.id, user.username, user.tenantId);

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
    };
  }

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    const token = this.generateTokens(user.id, user.username, user.tenantId);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: token.refreshToken,
      },
    });

    return token;
  }

  private generateTokens(userId: number, username: string, tenantId: number) {
    const payload = {
      sub: userId,
      username,
      tenantId,
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