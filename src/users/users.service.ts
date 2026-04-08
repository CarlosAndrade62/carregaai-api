import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

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