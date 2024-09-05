import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDTO } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { GetOrderDTO } from './dto/get-order.dto';
import { PutOrderDTO, UpdateOrderStatusDTO } from './dto/put-order.dto';

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

  @Get()
  @ApiOperation({ summary: '내가 주문한 금 목록' })
  async getManyOrder(
    @User('userId') userId: number,
    @Query() query: GetOrderDTO,
  ) {
    return await this.orderService.fetchManyOrder({ userId, ...query });
  }

  @Get('/:id')
  @ApiOperation({ summary: '내가 주문한 금 상세보기' })
  async getOrder(
    @User('userId') userId: number,
    @Param('id', ParseIntPipe) orderId: number,
  ) {
    return await this.orderService.fetchOrder({ userId, orderId });
  }

  @Put('/:id')
  @ApiOperation({ summary: '내가 주문한 금 수정하기' })
  async putOrder(
    @User('userId') userId: number,
    @Param('id', ParseIntPipe) orderId: number,
    @Body() body: PutOrderDTO,
  ) {
    return await this.orderService.modifyOrder({ userId, orderId, ...body });
  }

  @Patch('/:id/status')
  @ApiOperation({ summary: '주문한 금 상태 변경하기' })
  async patchOrderByStatus(
    @User('userId') userId: number,
    @Param('id', ParseIntPipe) orderId: number,
    @Body() { status }: UpdateOrderStatusDTO,
  ) {
    return await this.orderService.modifyOrderByStatus({
      userId,
      orderId,
      status,
    });
  }

  @Delete('/:id')
  @ApiOperation({ summary: '주문 삭제하기' })
  async deleteOrder(
    @User('userId') userId: number,
    @Param('id', ParseIntPipe) orderId: number,
  ) {
    return await this.orderService.removeOrder({
      userId,
      orderId,
    });
  }
}
