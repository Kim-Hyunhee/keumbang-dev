import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserSignUpDTO } from './dto/sign-up.dto';
import { UserService } from '../user/user.service';
import { UserLogInDTO } from './dto/log-in.dto';
import { AuthService } from './auth.service';
import { RefreshTokenDTO } from '../refresh-token/dto/refresh-token.dto';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { GrpcMethod } from '@nestjs/microservices';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  @Post('/sign-up')
  @ApiOperation({ summary: '회원 가입' })
  async postSignUp(@Body() body: UserSignUpDTO) {
    return await this.userService.createUser(body);
  }

  @Post('/log-in')
  @ApiOperation({ summary: '로그인' })
  async postLogin(@Body() body: UserLogInDTO) {
    return await this.authService.fetchUser(body);
  }

  @Post('/refresh-token')
  @ApiOperation({ summary: 'refresh token 검증하여 access token 재발급' })
  async refreshToken(@Body() { refreshToken }: RefreshTokenDTO) {
    return await this.authService.refreshToken({ refreshToken });
  }

  @Post('log-out')
  @ApiOperation({ summary: '로그아웃' })
  async postLogOut(@Body() { refreshToken }: RefreshTokenDTO) {
    return await this.refreshTokenService.removeAccessToken({ refreshToken });
  }

  @GrpcMethod('AuthService', 'VerifyToken')
  async verifyToken(data: { token: string }): Promise<any> {
    const { token } = data;
    try {
      const result = await this.authService.validateToken(token);
      return { valid: result.isValid, user: result.user };
    } catch (error) {
      throw new Error(`Error validating token: ${error.message}`);
    }
  }
}
