import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors({
    origin: [
      `${process.env.URL}:80`,
      `${process.env.URL}:8080`,
      process.env.URL,
      'http://fireking5997.com',
      'http://fireking5997.xyz',
      'http://www.fireking5997.xyz',
      'http://www.fireking5997.com',
      'http://localhost:3000',
    ],
    allowedHeaders: [
      'X-Requested-With',
      'X-HTTP-Method-Override',
      'Content-Type',
      'Accept',
      'Origin',
    ],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
      transform: true,
    }),
  );

  await app.listen(process.env.PORT);
}
bootstrap();
