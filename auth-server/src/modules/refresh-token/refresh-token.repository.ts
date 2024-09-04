import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  // refresh token 저장
  async insertRefreshToken({
    token,
    userId,
  }: {
    token: string;
    userId: number;
  }) {
    return await this.prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7일 후
      },
    });
  }

  // refresh token 검증
  async refreshToken({ refreshToken }: { refreshToken: string }) {
    const token = await this.prisma.refreshToken.findFirst({
      where: { token: refreshToken },
    });

    // 저장된 토큰이 없거나 오늘보다 token의 유효기간이 더 클 경우 에러 처리
    if (!token || new Date() > token.expiresAt) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // 토큰 검증 및 사용자 검증
    const payload = this.jwtService.verify(refreshToken);

    const user = await this.userService.fetchUser(payload.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // 새로운 access token 발급(15분)
    const newAccessToken = this.jwtService.sign(
      { userId: user.id },
      { expiresIn: '15m' },
    );

    return { accessToken: newAccessToken };
  }

  // refresh token 삭제 로직
  async logout({ refreshToken }: { refreshToken: string }) {
    await this.prisma.refreshToken.delete({ where: { token: refreshToken } });
  }
}
