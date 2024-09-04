import { Injectable } from '@nestjs/common';
import { RefreshTokenRepository } from './refresh-token.repository';

@Injectable()
export class RefreshTokenService {
  constructor(private repository: RefreshTokenRepository) {}

  // refresh token 생성
  async createRefreshToken({
    token,
    userId,
  }: {
    token: string;
    userId: number;
  }) {
    return await this.repository.insertRefreshToken({ token, userId });
  }

  // refresh token 을 이용하여 새로운 access token 생성
  async newAccessToken({ refreshToken }: { refreshToken: string }) {
    return await this.repository.refreshToken({ refreshToken });
  }

  // refresh token 삭제
  async removeAccessToken({ refreshToken }: { refreshToken: string }) {
    return await this.repository.logout({ refreshToken });
  }
}
