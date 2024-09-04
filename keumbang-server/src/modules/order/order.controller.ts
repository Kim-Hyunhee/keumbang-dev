import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDTO } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';

@ApiTags('orders')
@ApiBearerAuth('access-token')
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('/sales')
  @ApiOperation({ summary: '금 판매' })
  async postOrderBySales(
    @Body() body: CreateOrderDTO,
    @User('userId') userId: number,
  ) {
    const invoiceType = 'sales';

    return await this.orderService.createOrder({
      userId,
      invoiceType,
      ...body,
    });
  }

  @Post('/purchase')
  @ApiOperation({ summary: '금 구매' })
  async postOrderByPurchase(
    @Body() body: CreateOrderDTO,
    @User('userId') userId: number,
  ) {
    const invoiceType = 'purchase';

    return await this.orderService.createOrder({
      userId,
      invoiceType,
      ...body,
    });
  }
}
