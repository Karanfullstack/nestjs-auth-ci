import { Inject, Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import Redis from 'ioredis';
import appConfig from 'src/config/app.config';

// Put this in a separate file
export class InvalidateRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenIdsStorage implements OnApplicationBootstrap, OnApplicationShutdown {
    redisClient: Redis;
    constructor(@Inject(appConfig.KEY) private readonly config: ConfigType<typeof appConfig>) {}

    onApplicationBootstrap() {
        // Todo: Move to Redis Module
        // instead of initiating the connection here.
        this.redisClient = new Redis({
            host: this.config.redisHost, // move it to config
            port: this.config.redisPort, // move it to config
        });
    }

    onApplicationShutdown() {
        this.redisClient.quit();
    }

    insert(userId: number, tokenId: string) {
        return this.redisClient.set(this.getKey(userId), tokenId);
    }

    async validate(userId: number, tokenId: string): Promise<boolean> {
        const token_id = await this.redisClient.get(this.getKey(userId));

        if (token_id !== tokenId) {
            throw new InvalidateRefreshTokenError();
        }
        return token_id === tokenId;
    }

    async inValidate(userId: number): Promise<void> {
        await this.redisClient.del(this.getKey(userId));
    }

    private getKey(userId: number) {
        return `user-${userId}`;
    }
}
