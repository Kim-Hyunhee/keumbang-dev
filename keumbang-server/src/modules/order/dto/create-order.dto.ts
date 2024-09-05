import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateOrderDTO {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  itemId: number;

  @ApiProperty({ example: '12.11' })
  @IsNotEmpty()
  @IsString()
  quantity: string;

  @ApiProperty({ example: 'OO시 OO구 OO동, OO동 OO호' })
  @IsNotEmpty()
  @IsString()
  deliveryAddress: string;
}
