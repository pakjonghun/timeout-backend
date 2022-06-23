"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const allowList = [
        'http://fireking5997.com',
        'http://localhost:3000',
        process.env.BASE_URL,
    ];
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.use(cookieParser());
    app.enableCors({
        origin: (origin, callback) => {
            const allowed = allowList.includes(origin);
            if (allowed)
                callback(null, true);
            else
                throw new common_1.UnauthorizedException('UnAccepted Cors');
        },
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