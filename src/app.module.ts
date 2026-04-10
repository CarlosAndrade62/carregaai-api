import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoadingControlModule } from './loading-control/loading-control.module';


@Module({
  imports: [
    LoadingControlModule,
    PrismaModule,
    AuthModule,
    UsersModule
  ],
})
export class AppModule {}