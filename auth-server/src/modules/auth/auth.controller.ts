import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserSignUpDTO } from './dto/signup.dto';
import { UserService } from '../user/user.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('/signUp')
  async postSignUp(@Body() body: UserSignUpDTO) {
    return await this.userService.createUser(body);
  }
}
