import { IsInt, IsNotEmpty, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterDto {
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @Type(() => Number)
  @IsInt()
  tenantId: number;
}