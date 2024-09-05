import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from './dto/put-order.dto';
import { Status } from '@prisma/client'; // 'Status'는 Prisma에서 자동 생성된 enum

@Injectable()
export class OrderRepository {
  constructor(private prisma: PrismaService) {}

  async insertOrder(data: InsertOrder) {
    return await this.prisma.order.create({ data });
  }

  async findManyOrder(where: {
    userId: number;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
    invoiceType?: string;
  }) {
    const { startDate, endDate, limit, offset, ...otherWhere } = where;

    const and =
      startDate !== undefined && endDate !== undefined
        ? {
            AND: {
              orderDate: {
                gte: new Date(startDate),
                lte: new Date(endDate),
              },
            },
          }
        : {};

    const [orders, totalCount] = await Promise.all([
      this.prisma.order.findMany({
        where: {
          ...otherWhere,
          AND: and,
        },
        take: limit,
        skip: offset,
      }),
      this.prisma.order.count({
        where: {
          ...otherWhere,

          AND: and,
        },
      }),
    ]);

    return { orders, totalCount };
  }

  async findOrder(where: { userId: number; id: number }) {
    return await this.prisma.order.findFirst({ where });
  }

  async updateOrder({
    where,
    data,
  }: {
    where: { userId: number; id: number };
    data: {
      itemId?: number;
      invoiceType?: string;
      quantity?: string;
      deliveryAddress?: string;
      amount?: number;
    };
  }) {
    return await this.prisma.order.update({ where, data });
  }

  async updateOrderByStatus({
    where,
    data,
  }: {
    where: { userId: number; id: number };
    data: {
      status: Status;
    };
  }) {
    return await this.prisma.order.update({ where, data });
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
