import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import Redis from 'ioredis';

// Put this in a separate file
export class InvalidateRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenIdsStorage implements OnApplicationBootstrap, OnApplicationShutdown {
    redisClient: Redis;
    onApplicationBootstrap() {
        // Todo: Move to Redis Module
        // instead of initiating the connection here.
        this.redisClient = new Redis({
            host: 'localhost', // move it to config
            port: 6379, // move it to config
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
