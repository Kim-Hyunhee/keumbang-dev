import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  // userName 또는 id로 해당 사용자 찾는 로직
  async findUser({ where }: { where: { userName?: string; id?: number } }) {
    return await this.prisma.user.findFirst({ where });
  }

  // 사용자 테이블에 저장
  async insertUser(data: InsertUser) {
    return await this.prisma.user.create({ data });
  }

  // 사용자 정보 업데이트
  async updateUser({
    where,
    data,
  }: {
    where: { id: number };
    data: { refreshToken: string };
  }) {
    const user = await this.findUser({ where });
    if (!user) {
      throw new UnauthorizedException('가입된 유저가 아닙니다.');
    }

    return await this.prisma.user.update({ where: { id: where.id }, data });
  }
}

export type InsertUser = {
  userName: string;
  password: string;
};
