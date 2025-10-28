import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import appConfig from './config/app.config';

async function bootstrap() {
    const logger = new Logger('Bootstraping');
    const app = await NestFactory.create(AppModule, { bufferLogs: true });
    app.useLogger(logger);
    app.enableCors();
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );
    const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
    await app.listen(config.port);
    logger.log(`Application is running on: http://localhost:${config.port}`);
    logger.log(`Database URL: ${config.databaseUrl}`);
}
bootstrap();
