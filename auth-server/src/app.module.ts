import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RefreshTokenModule } from './modules/refresh-token/refresh-token.module';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as path from 'path';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    RefreshTokenModule,
    ConfigModule.forRoot({
      isGlobal: true, // ConfigModule을 전역 모듈로 설정하여 어디서든 사용 가능
      envFilePath: '.env', // 환경 변수 파일 경로 설정
    }),
    ClientsModule.register([
      {
        name: 'AUTH_PACKAGE', // gRPC 클라이언트의 이름
        transport: Transport.GRPC,
        options: {
          package: 'auth', // auth.proto의 package 이름과 일치
          protoPath: path.join(process.cwd(), 'src/protos/auth.proto'), // auth.proto 파일 경로
          url: '127.0.0.1:50051', // 인증 서버 B의 gRPC 주소 (포트)
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
