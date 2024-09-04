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
}
