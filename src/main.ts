import { UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const allowList = [
    'http://fireking5997.com',
    'http://localhost:3000',
    process.env.BASE_URL,
  ];

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.use(cookieParser());

  app.enableCors({
    origin: (origin, callback) => {
      const allowed = allowList.includes(origin);
      if (allowed) callback(null, true);
      else throw new UnauthorizedException('UnAccepted Cors');
    },
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
