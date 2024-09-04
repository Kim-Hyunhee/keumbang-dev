import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Payload } from './jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  // 로그인 정보가 맞다면 access token, refresh token 발급
  async fetchUser({
    userName,
    password,
  }: {
    userName: string;
    password: string;
  }) {
    const user = await this.userService.fetchUser({ userName });
    if (!user) {
      throw new UnauthorizedException('가입된 유저가 아닙니다.');
    }

    await this.checkUserPassword({ user, password: password });

    const token = await this.generateToken({
      userId: user.id,
    });

    return token;
  }

  // 비밀번호가 맞는지 확인하는 로직
  async checkUserPassword({
    user,
    password,
  }: {
    user: User;
    password: string;
  }) {
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new BadRequestException('PW 오류입니다. 다시 시도해주세요.');
    }

    return isValid;
  }

  // access token, refresh token 생성 로직
  async generateToken({ userId }: { userId: number }) {
    const payload: Payload = {
      userId,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });

    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.refreshTokenService.createRefreshToken({
      userId,
      token: refreshToken,
    });

    return { accessToken, refreshToken };
  }

  // refresh token 유효성 검증
  async refreshToken({ refreshToken }: { refreshToken: string }) {
    try {
      // Refresh Token 검증
      const decoded = this.jwtService.verify(refreshToken);

      // Refresh Token이 유효하고 사용자의 존재를 확인
      const user = await this.userService.fetchUser(decoded.userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // 새로운 Access Token 발급
      const newAccessToken = this.jwtService.sign(
        { userId: user.id },
        { expiresIn: '15m' },
      );
      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid Refresh Token');
    }
  }
}
