import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDTO {
  @ApiProperty({
    required: true,
    example: 'asf,jdfnKAneolikdmrgmoismfodmefnNw',
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
