import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderRepository {
  constructor(private prisma: PrismaService) {}

  async insertOrder(data: InsertOrder) {
    return await this.prisma.order.create({ data });
  }
}

export type InsertOrder = {
  userId: number;
  itemId: number;
  invoiceType: string;
  orderDate: Date;
  quantity: string;
  orderNumber: string;
  deliveryAddress: string;
  amount: number;
};
