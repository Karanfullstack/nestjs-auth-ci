import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
    secret: process.env.JWT_SECRET,
    accessTokenTtl: parseInt(process.env.JWT_EXPIRES_IN ?? '3600', 10), // 1 hour
    refreshTokenTtl: parseInt(process.env.REFRESH_JWT_EXPIRES_IN ?? '86400', 10), // 1 day
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
}));
