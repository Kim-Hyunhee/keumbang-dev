import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('trust proxy', true);
  app.enableCors({});
  // 글로벌 ValidationPipe 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 속성 제거
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 속성이 들어오면 예외 발생
      transform: true, // 요청 데이터를 자동으로 DTO 인스턴스로 변환
    }),
  );

  // gRPC microservice
  const grpcOptions: MicroserviceOptions = {
    transport: Transport.GRPC,
    options: {
      package: 'resource', // Matches proto package
      protoPath: path.join(process.cwd(), 'src/protos/resource.proto'),
      url: '0.0.0.0:50052', // gRPC port for Server A
    },
  };

  app.connectMicroservice(grpcOptions);
  await app.startAllMicroservices();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('keumbang')
    .setDescription('keumbang API DOCS')
    .setVersion('0.1')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        in: 'header',
        name: 'JWT',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'method',
    },
  });

  app.enableShutdownHooks();

  await app.listen(9999);
}
bootstrap();
