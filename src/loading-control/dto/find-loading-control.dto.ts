import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindLoadingControlDto {
  @ApiPropertyOptional({
    example: 0,
    description: 'Quantidade de registros a pular',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Quantidade de registros a retornar',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  take?: number;

  @ApiPropertyOptional({
    example: 5,
    description: 'Retornar registros com status menor que o valor informado',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  statusLt?: number;
}