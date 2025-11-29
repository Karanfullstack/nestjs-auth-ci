import { Module } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from '../config/app.config';
// testtin purpose
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const appConf = config.get<ConfigType<typeof appConfig>>('app');
                return {
                    type: 'postgres',
                    host: appConf.host,
                    port: appConf.databasePort,
                    username: appConf.databaseUser,
                    password: appConf.databasePassword,
                    database: appConf.databaseName,
                    autoLoadEntities: true,
                    synchronize: true,
                };
            },
        }),
    ],
})
export class CoreModule {}
