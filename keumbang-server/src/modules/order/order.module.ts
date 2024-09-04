import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, JwtAuthGuard],
})
export class OrderModule {}
