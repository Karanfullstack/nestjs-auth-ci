import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';

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
