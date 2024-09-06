import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './modules/order/order.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ItemModule } from './modules/item/item.module';
import * as path from 'path';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
    ClientsModule.register([
      {
        name: 'AUTH_PACKAGE', // gRPC 클라이언트의 이름
        transport: Transport.GRPC,
        options: {
          package: 'auth', // 실제 proto package 이름
          protoPath: path.join(process.cwd(), 'src/protos/auth.proto'),
          url: '127.0.0.1:50051',
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
