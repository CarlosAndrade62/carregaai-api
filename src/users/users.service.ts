import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../auth/dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        tenantId: true,
        createdAt: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async create(dto: CreateUserDto) {
  const exists = await this.prisma.user.findFirst({
    where: {
      username: dto.username,
      tenantId: dto.tenantId,
    },
  });

  if (exists) {
    throw new BadRequestException('Já existe usuário com esse username neste tenant.');
  }

  const hashedPassword = await bcrypt.hash(dto.password, 10);

  return this.prisma.user.create({
    data: {
      username: dto.username,
      password: hashedPassword,
      role: dto.role,
      tenantId: dto.tenantId,
    },
    select: {
      id: true,
      username: true,
      role: true,
      tenantId: true,
      createdAt: true,
    },
  });
}

  async changePassword(id: number, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });

    return {
      message: 'Senha alterada com sucesso.',
    };
  }
}