import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetOrderDTO {
  @ApiProperty({ required: false, example: '2024-09-04' })
  @IsDateString()
  @IsOptional()
  date: Date;

  @ApiProperty({
    required: false,
    example: 10,
    description: '숫자만큼의 행 출력',
  })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  limit: number;

  @ApiProperty({
    required: false,
    example: 10,
    description: '몇번째부터 출력할 지',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset: number;

  @ApiProperty({ required: false, enum: ['sales', 'purchase'] })
  @IsString()
  @IsOptional()
  invoiceType: string;
}
