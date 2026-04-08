import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  role: Role;

  @Type(() => Number)
  @IsInt()
  tenantId: number;
}