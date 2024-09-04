import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ItemRepository {
  constructor(private prisma: PrismaService) {}

  async findManyItem() {
    return await this.prisma.item.findMany();
  }
}
