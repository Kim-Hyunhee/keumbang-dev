import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { Status } from '@prisma/client';
import { ItemService } from '../item/item.service';

@Injectable()
export class OrderService {
  constructor(
    private repository: OrderRepository,
    private itemService: ItemService,
  ) {}

  async createOrder(data: {
    userId: number;
    itemId: number;
    invoiceType: string;
    quantity: string;
    deliveryAddress: string;
  }) {
    const orderDate = new Date(Date.now());
    const orderNumber = '' + Date.now();

    // 소수점 2자리까지만 적었는지 확인
    const condition = new RegExp(/^\d+(\.\d{1,2})?$/);
    if (!condition.test(data.quantity)) {
      throw new BadRequestException(
        'Quantity must be a valid number with up to 2 decimal places.',
      );
    }

    const formattedQuantity = parseFloat(data.quantity).toFixed(2);
    const item = await this.itemService.fetchItem({ itemId: data.itemId });

    let amountValue = 0;
    if (data.invoiceType === 'sales') {
      amountValue = item.sellPrice * +data.quantity;
    } else amountValue = item.buyPrice * +data.quantity;

    return await this.repository.insertOrder({
      orderDate,
      orderNumber,
      quantity: formattedQuantity,
      amount: amountValue,
      ...data,
    });
  }

  async fetchManyOrder({
    userId,
    date,
    limit,
    offset,
    invoiceType,
  }: {
    userId: number;
    date: Date;
    limit: number;
    offset: number;
    invoiceType: string;
  }) {
    const options = { timeZone: 'Asia/Seoul' };

    const startDate = new Date(date.toLocaleString('en-US', options));
    startDate.setUTCDate(startDate.getDate());
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(date.toLocaleString('en-US', options));
    endDate.setUTCHours(23, 59, 59, 999);

    const { orders, totalCount } = await this.repository.findManyOrder({
      userId,
      startDate,
      endDate,
      limit,
      offset,
      invoiceType,
    });

    // pagination 정보 계산
    const totalPages = Math.ceil(totalCount / limit);

    const baseUrl = 'http://localhost:9999/api/orders';

    const links = {
      self: {
        href: `${baseUrl}?limit=${limit}&offset=${offset}`,
      },
      first: {
        href: `${baseUrl}?limit=${limit}&offset=0`,
      },
      last: {
        href: `${baseUrl}?limit=${limit}&offset=${(totalPages - 1) * limit}`,
      },
      next: {
        href:
          offset + limit < totalCount
            ? `${baseUrl}?limit=${limit}&offset=${offset + limit}`
            : null,
      },
      prev: {
        href:
          offset - limit >= 0
            ? `${baseUrl}?limit=${limit}&offset=${offset - limit}`
            : null,
      },
    };
    return {
      success: true,
      message: 'Success to search orders',
      data: orders,
      links,
    };
  }

  async fetchOrder({ userId, orderId }: { userId: number; orderId: number }) {
    const order = await this.repository.findOrder({ userId, id: orderId });
    if (!order) {
      throw new NotFoundException('주문이 존재하지 않습니다.');
    }

    return order;
  }

  async modifyOrder({
    userId,
    orderId,
    itemId,
    invoiceType,
    quantity,
    deliveryAddress,
  }: {
    userId: number;
    orderId: number;
    itemId?: number;
    invoiceType?: string;
    quantity?: string;
    deliveryAddress?: string;
  }) {
    await this.fetchOrder({ userId, orderId });

    let formattedQuantity = '';
    if (quantity) {
      // 소수점 2자리까지만 적었는지 확인
      const condition = new RegExp(/^\d+(\.\d{1,2})?$/);
      if (!condition.test(quantity)) {
        throw new BadRequestException(
          'Quantity must be a valid number with up to 2 decimal places.',
        );
      }
    }

    formattedQuantity = parseFloat(quantity).toFixed(2);

    const item = await this.itemService.fetchItem({ itemId });

    let amountValue = 0;
    if (invoiceType === 'sales') {
      amountValue = item.sellPrice * +quantity;
    } else amountValue = item.buyPrice * +quantity;

    return await this.repository.updateOrder({
      where: { userId, id: orderId },
      data: {
        itemId,
        invoiceType,
        quantity: formattedQuantity,
        deliveryAddress,
        amount: amountValue,
      },
    });
  }

  async modifyOrderByStatus({
    userId,
    orderId,
    status,
  }: {
    userId: number;
    orderId: number;
    status: Status;
  }) {
    return await this.repository.updateOrderByStatus({
      where: { userId, id: orderId },
      data: { status },
    });
  }

  async removeOrder({ userId, orderId }: { userId: number; orderId: number }) {
    await this.fetchOrder({ userId, orderId });

    return await this.repository.deleteOrder({
      where: { id: orderId, userId },
    });
  }
}
