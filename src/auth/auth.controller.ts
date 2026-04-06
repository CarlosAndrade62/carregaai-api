import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Delete,
  Param,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @UseGuards(AuthGuard('jwt'))
@Post('users')
createUser(
  @Req() req: any,
  @Body() dto: CreateUserDto,
) {
  return this.authService.createUserByAdmin(
    req.user.id,
    req.user.tenantId,
    dto,
  );
}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('debug')
  debug(@Req() req: any) {
    return {
      message: 'Acesso autorizado 🚀',
      user: req.user,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('users')
  getUsers(@Req() req: any) {
    return this.authService.findAllByTenant(req.user.tenantId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('change-password')
  changePassword(@Req() req: any, @Body() body: { password: string }) {
    if (!body?.password || body.password.length < 6) {
      throw new BadRequestException(
        'A nova senha deve ter no mínimo 6 caracteres',
      );
    }

    return this.authService.changePassword(req.user.id, body.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('users/:id/reset-password')
  resetUserPassword(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
    @Body() body: { password: string },
  ) {
    if (!body?.password || body.password.length < 6) {
      throw new BadRequestException(
        'A nova senha deve ter no mínimo 6 caracteres',
      );
    }

    return this.authService.adminResetUserPassword(
      req.user.id,
      id,
      req.user.tenantId,
      body.password,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('users/:id')
  deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    if (id === req.user.id) {
      throw new BadRequestException(
        'Não é permitido excluir o próprio usuário',
      );
    }

    return this.authService.deleteUser(id, req.user.tenantId);
  }
}