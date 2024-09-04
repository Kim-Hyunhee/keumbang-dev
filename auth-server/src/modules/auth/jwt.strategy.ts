import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 헤더 Authentication 에서 Bearer 토큰으로부터 jwt를 추출함
      secretOrKey: 'JWT_SECRET_KEY', // jwt 생성시 비밀키로 사용할 텍스트 (노출 X)
      ignoreExpiration: false, // jwt 만료를 무시할 것인지 (기본값: false)
    });
  }

  // 토큰 검증
  async validate(payload: Payload) {
    const user = await this.userService.fetchUser({
      id: payload.userId,
    });

    // token에 userId 있으면 넘겨주고, 없으면 에러 처리
    if (user) {
      return user;
    } else {
      throw new ForbiddenException('접근 오류');
    }
  }
}

export type Payload = {
  userId: number;
};
