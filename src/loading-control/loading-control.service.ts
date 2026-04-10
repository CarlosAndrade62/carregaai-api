import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLoadingControlDto } from './dto/create-loading-control.dto';
import { UpdateLoadingControlDto } from './dto/update-loading-control.dto';
import { FindLoadingControlDto } from './dto/find-loading-control.dto';
import { Prisma } from '@prisma/client';
import { LoadingControlStatus } from './enums/loading-control-status.enum';

@Injectable()
export class LoadingControlService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLoadingControlDto, tenantId: number) {
    const existing = await this.prisma.loadingControl.findFirst({
      where: {
        id: dto.id,
        tenantId,
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Já existe um carregamento com o id ${dto.id} para este tenant.`,
      );
    }

    return this.prisma.loadingControl.create({
      data: {
        id: dto.id,
        plate: dto.plate,
        material: dto.material,
        quantity: new Prisma.Decimal(dto.quantity),
        additionalQuantity:
          dto.additionalQuantity !== undefined
            ? new Prisma.Decimal(dto.additionalQuantity)
            : null,
        status: dto.status ?? LoadingControlStatus.WAITING,
        tenantId,
      },
    });
  }

  async update(id: number, tenantId: number, dto: UpdateLoadingControlDto) {
    const loading = await this.prisma.loadingControl.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!loading) {
      throw new NotFoundException('Carregamento não encontrado.');
    }

    return this.prisma.loadingControl.update({
      where: { id },
      data: {
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.quantity !== undefined && {
          quantity: new Prisma.Decimal(dto.quantity),
        }),
        ...(dto.additionalQuantity !== undefined && {
          additionalQuantity: new Prisma.Decimal(dto.additionalQuantity),
        }),
      },
    });
  }

  async findAll(tenantId: number, query: FindLoadingControlDto) {
    const { skip = 0, take = 20, statusLt } = query;

    return this.prisma.loadingControl.findMany({
      where: {
        tenantId,
        ...(statusLt !== undefined && {
          status: {
            lt: statusLt,
          },
        }),
      },
      orderBy: {
        id: 'desc',
      },
      skip,
      take,
    });
  }

  async findOne(id: number, tenantId: number) {
    const loading = await this.prisma.loadingControl.findFirst({
      where: {
        id,
        tenantId,
      },
    });

    if (!loading) {
      throw new NotFoundException('Carregamento não encontrado.');
    }

    return loading;
  }
}