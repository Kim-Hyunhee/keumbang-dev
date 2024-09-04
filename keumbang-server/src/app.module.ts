import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './modules/order/order.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ItemModule } from './modules/item/item.module';

@Module({
  imports: [
    OrderModule,
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true, // ConfigModule을 전역 모듈로 설정하여 어디서든 사용 가능
      envFilePath: '.env', // 환경 변수 파일 경로 설정
    }),
    ItemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
