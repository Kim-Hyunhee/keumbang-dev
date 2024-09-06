import { Controller, Post, Body } from '@nestjs/common';
import { VerifyTokenDTO } from './dto/verify-token.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/verify-token')
  async verifyTokens(@Body() { token }: VerifyTokenDTO) {
    try {
      const response = await this.authService.verifyToken({ token });
      return response;
    } catch (error) {
      console.error('Error validating token:', error);
      throw new Error('Error validating token');
    }
  }
}
