"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
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
        allowedHeaders: 'Origin',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
        transform: true,
    }));
    await app.listen(process.env.PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map