import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
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
}

export enum OrderStatus {
  OrderPlaced = 'OrderPlaced', // 주문 완료
  PaymentCompleted = 'PaymentCompleted', // 입금 완료
  Shipped = 'Shipped', // 발송 완료
  PaymentTransferred = 'PaymentTransferred', // 송금 완료
  Received = 'Received', // 수령 완료
}

export class UpdateOrderStatusDTO {
  @ApiProperty({
    enum: [
      'OrderPlaced',
      'PaymentCompleted',
      'Shipped',
      'PaymentTransferred',
      'Received',
    ],
    description:
      'OrderPlaced: 주문완료, PaymentCompleted: 입금완료, Shipped: 발송완료, PaymentTransferred: 송금완료, Received:수령완료',
  })
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus;
}
