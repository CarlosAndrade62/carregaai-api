import { IsOptional, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { LoadingControlStatus } from '../enums/loading-control-status.enum';

export class UpdateLoadingControlDto {
  @ApiPropertyOptional({
    enum: LoadingControlStatus,
    example: LoadingControlStatus.LOADING,
    description: 'Novo status do carregamento',
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(LoadingControlStatus)
  status?: LoadingControlStatus;

  @ApiPropertyOptional({
    example: 18.75,
    description: 'Nova quantidade principal',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  quantity?: number;

  @ApiPropertyOptional({
    example: 1.25,
    description: 'Ajuste adicional positivo ou negativo',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  additionalQuantity?: number;
}