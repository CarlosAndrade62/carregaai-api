import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LoadingControlStatus } from '../enums/loading-control-status.enum';

export class CreateLoadingControlDto {
  @ApiProperty({
    example: 1001,
    description: 'ID do carregamento gerado pelo sistema Delphi',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    example: 'ABC1D23',
    description: 'Placa do veículo',
  })
  @IsString()
  @IsNotEmpty()
  plate: string;

  @ApiProperty({
    example: 'Brita',
    description: 'Material a ser carregado',
  })
  @IsString()
  @IsNotEmpty()
  material: string;

  @ApiProperty({
    example: 20.5,
    description: 'Quantidade principal do carregamento',
  })
  @Type(() => Number)
  @IsNumber()
  quantity: number;

  @ApiPropertyOptional({
    example: -2.5,
    description: 'Quantidade adicional positiva ou negativa',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  additionalQuantity?: number;

  @ApiPropertyOptional({
    enum: LoadingControlStatus,
    example: LoadingControlStatus.WAITING,
    description: 'Status do carregamento',
  })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(LoadingControlStatus)
  status?: LoadingControlStatus;
}