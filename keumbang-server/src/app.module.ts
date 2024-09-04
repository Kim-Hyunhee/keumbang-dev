import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './modules/order/order.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [OrderModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
