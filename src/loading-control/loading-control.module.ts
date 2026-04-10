import { Module } from '@nestjs/common';
import { LoadingControlController } from './loading-control.controller';
import { LoadingControlService } from './loading-control.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LoadingControlController],
  providers: [LoadingControlService],
})
export class LoadingControlModule {}