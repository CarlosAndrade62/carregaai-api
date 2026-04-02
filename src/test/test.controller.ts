import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { Tenant } from '../common/decorators/tenant.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('test')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TestController {

  @Get()
  @Roles(Role.ADMIN)
  getProtected(
    @Tenant() tenantId: number,
    @CurrentUser() user: any,
  ) {
    return {
      message: 'Tenant isolado com sucesso 🚀',
      tenantId,
      user,
    };
  }
}