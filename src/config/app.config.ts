import { registerAs } from '@nestjs/config';
import * as fs from 'node:fs';

const readEnvFromFile = (name: string): string => {
    try {
        const filePath = process.env[`${name}_FILE`];
        if (filePath && fs.existsSync(filePath)) {
            return fs.readFileSync(filePath, 'utf8').trim();
        }
        return process.env[name] ?? '';
    } catch (error) {
        console.log('env file failed', error, name);
        return '';
    }
};

export default registerAs('app', () => ({
    port: parseInt(readEnvFromFile('PORT'), 10) || 3000,
    databaseUrl: readEnvFromFile('DATABASE_URL'),
    databasePort: parseInt(readEnvFromFile('DATABASE_PORT'), 10),
    databaseName: readEnvFromFile('DATABASE_NAME'),
    databasePassword: readEnvFromFile('DATABASE_PASSWORD'),
    databaseUser: readEnvFromFile('DATABASE_USER'),
    redisPort: parseInt(readEnvFromFile('REDIS_PORT'), 10),
    redisHost: readEnvFromFile('REDIS_HOST'),
    host: readEnvFromFile('HOST'),
    jwtSecret: readEnvFromFile('JWT_SECRET'),
    jwtExpiresIn: readEnvFromFile('JWT_EXPIRES_IN'),
    jwtIssuer: readEnvFromFile('JWT_ISSUER'),
    jwtAudience: readEnvFromFile('JWT_AUDIENCE'),
}));
