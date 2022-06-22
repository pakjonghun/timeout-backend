"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const Joi = require("joi");
const path_1 = require("path");
const user_module_1 = require("./user/user.module");
const common_module_1 = require("./common/common.module");
const auth_middleware_1 = require("./user/middlewares/auth.middleware");
const core_1 = require("@nestjs/core");
const auth_guard_1 = require("./user/auth.guard");
const message_interceptor_1 = require("./common/interceptors/message.interceptor");
const record_module_1 = require("./record/record.module");
const event_module_1 = require("./event/event.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(auth_middleware_1.AuthMiddleware)
            .forRoutes({ path: '*', method: common_1.RequestMethod.ALL });
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
                validationSchema: Joi.object({
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
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => {
                    return {
                        type: 'mysql',
                        host: configService.get('DB_HOST'),
                        port: configService.get('DB_PORT'),
                        username: configService.get('DB_USERNAME'),
                        password: configService.get('DB_PASSWORD'),
                        database: configService.get('DB_DATABASE'),
                        entities: [(0, path_1.resolve)(__dirname, '**', '*.entity.{ts,js}')],
                        synchronize: false,
                        logging: false,
                    };
                },
                inject: [config_1.ConfigService],
            }),
            user_module_1.UserModule,
            common_module_1.CommonModule,
            record_module_1.RecordModule,
            event_module_1.EventModule,
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: auth_guard_1.AuthGuard,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: message_interceptor_1.MessageInterceptor,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map