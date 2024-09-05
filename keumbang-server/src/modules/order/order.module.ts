import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ItemModule } from '../item/item.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, JwtAuthGuard],
  imports: [ItemModule],
})
export class OrderModule {}
