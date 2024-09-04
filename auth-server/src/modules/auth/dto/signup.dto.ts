import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserSignUpDTO {
  @ApiProperty({ required: true, example: 'test@test.com' })
  @IsEmail()
  @IsNotEmpty()
  userName: string;

  @ApiProperty({ required: true, example: 'test!123' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
