import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    databaseUrl: process.env.DATABASE_URL,
    databasePort: parseInt(process.env.DATABASE_PORT, 10),
    databaseName: process.env.DATABASE_NAME,
    databasePassword: process.env.DATABASE_PASSWORD,
    databaseUser: process.env.DATABASE_USER,
    redisPort: parseInt(process.env.REDIS_PORT, 10),
    redisHost: process.env.REDIS_HOST,
    host: process.env.HOST,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    jwtIssuer: process.env.JWT_ISSUER,
    jwtAudience: process.env.JWT_AUDIENCE,
}));
