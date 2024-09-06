import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyTokenDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;
}
