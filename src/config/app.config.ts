import { registerAs } from '@nestjs/config';
import fs from 'node:fs';

const readEnvFromFile = (name: string): string => {
    const file_name = `${name}_FILE`;
    try {
        return fs.readFileSync(file_name, 'utf-8').trim();
    } catch (error) {
        console.log('failed to read file env', name, error);
    }
    return process.env[name];
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
