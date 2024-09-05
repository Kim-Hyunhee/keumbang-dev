import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PutOrderDTO {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  itemId: number;

  @ApiProperty({ example: '12.11' })
  @IsOptional()
  @IsString()
  quantity: string;

  @ApiProperty({ enum: ['sales', 'purchase'] })
  @IsOptional()
  @IsString()
  invoiceType: string;

  @ApiProperty({ example: 'OO시 OO구 OO동, OO동 OO호' })
  @IsOptional()
  @IsString()
  deliveryAddress: string;

  @ApiProperty({ example: 10000 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  amount: number;
}
