import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findUser({ where }: { where: { userName: string } }) {
    return await this.prisma.user.findFirst({ where });
  }

  async insertUser(data: InsertUser) {
    return await this.prisma.user.create({ data });
  }
}

export type InsertUser = {
  userName: string;
  password: string;
};
