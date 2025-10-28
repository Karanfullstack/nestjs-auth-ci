import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './auth/authentication/guards/access-token.guard';
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig],
            envFilePath: '.env',
        }),
        AuthModule,
        CoreModule,
        UserModule,
    ],
    providers: [],
})
export class AppModule {}
