import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { resolve } from 'path';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { AuthMiddleware } from './user/middlewares/auth.middleware';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './user/auth.guard';
import { MessageInterceptor } from './common/interceptors/message.interceptor';
import { RecordModule } from './record/record.module';
import { EventModule } from './event/event.module';
import { EventGateway } from './event/event.gateway';
import { DmModule } from './dm/dm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      ignoreEnvFile: process.env.NODE_ENV !== 'development',
      validationSchema: Joi.object({
        NODE_ENV: Joi.valid('development', 'production').required(),
        PORT: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        AWS_S3_BUCKET_NAME: Joi.string().required(),
        AWS_S3_ACCESS_KEY: Joi.string().required(),
        AWS_S3_SECRET_ACCESS_KEY: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [resolve(__dirname, '**', '*.entity.{ts,js}')],
          synchronize: true,
          logging: false,
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    CommonModule,
    RecordModule,
    EventModule,
    DmModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MessageInterceptor,
    },
    EventGateway,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
