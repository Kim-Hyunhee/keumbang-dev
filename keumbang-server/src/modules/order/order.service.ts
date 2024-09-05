import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(private repository: OrderRepository) {}

  async createOrder(data: {
    userId: number;
    itemId: number;
    invoiceType: string;
    quantity: string;
    deliveryAddress: string;
    amount: number;
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

    return await this.repository.insertOrder({
      orderDate,
      orderNumber,
      quantity: formattedQuantity,
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
}
