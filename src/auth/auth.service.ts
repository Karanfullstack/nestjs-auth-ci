import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { HashingService } from './hashing/hashing.service';
import { SignUpDto } from './dto/sign-up.dto';
import { UserEntity } from 'src/user/user-entity/user.entity';
import { SignInDto } from './dto/sign-in.dto';
import jwtConfig from './config/jwt-config';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ActiveUserPayload } from './authentication/interface/jwt-payload.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import {
    InvalidateRefreshTokenError,
    RefreshTokenIdsStorage,
} from './authentication/token-storage/refresh-token-ids.storage';
import { randomUUID } from 'node:crypto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private readonly userService: UserService,
        private readonly hashService: HashingService,
        private readonly jwtService: JwtService,
        private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
        @Inject(jwtConfig.KEY) private readonly jwt: ConfigType<typeof jwtConfig>,
    ) {}

    async signUp(signUpDto: SignUpDto): Promise<UserEntity> {
        this.logger.log(`Attempting to sign up user with email: ${signUpDto.email}`);
        const hashedPassword = await this.hashService.hash(signUpDto.password);

        try {
            await this.userService.findUserByEmail(signUpDto.email);
            const newUser = new UserEntity();
            newUser.email = signUpDto.email;
            newUser.password = hashedPassword;
            newUser.name = signUpDto.name;
            await this.userService.createUser(newUser);
            newUser.password = undefined;
            this.logger.log(`User with email ${signUpDto.email} signed up successfully`);
            return newUser;
        } catch (error) {
            throw error;
        }
    }

    async signIn(signInDto: SignInDto): Promise<{ accessToken: string; refreshToken: string }> {
        this.logger.log(`Attempting to sign in user with email: ${signInDto.email}`);
        try {
            const user = await this.userService.findUserByEmail(signInDto.email);
            if (!user) {
                this.logger.warn(`Sign in failed: User with email ${signInDto.email} not found`);
                throw new UnauthorizedException('Invalid credentials');
            }
            const isPasswordValid = await this.hashService.compare(
                signInDto.password,
                user.password,
            );
            if (!isPasswordValid) {
                this.logger.warn(`Sign in failed: Invalid password for email ${signInDto.email}`);
                throw new UnauthorizedException('Invalid credentials');
            }
            user.password = undefined;
            this.logger.log(`User with email ${signInDto.email} signed in successfully`);

            return await this.generateTokens(user);
        } catch (error) {
            this.logger.error(`Sign in failed: ${error.message}`);
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto) {
        this.logger.log(`Attempting to refresh token`);
        try {
            const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
                Pick<ActiveUserPayload, 'sub'> & { refreshTokenId: string }
            >(refreshTokenDto.refreshToken, {
                secret: this.jwt.secret,
                audience: this.jwt.audience,
                issuer: this.jwt.issuer,
            });
            const user = await this.userService.findUserByOrFail(sub);
            const isValid = await this.refreshTokenIdsStorage.validate(user.id, refreshTokenId);

            if (isValid) {
                this.logger.log(`Refresh token is valid for user ${user.id}`);
                await this.refreshTokenIdsStorage.inValidate(user.id);
            } else {
                throw new Error('Refresh token is invalid');
            }
            this.logger.log(`Token refreshed successfully for user ${user.id}`);
            return await this.generateTokens(user);
        } catch (error) {
            this.logger.error(`Token refresh failed: ${error.message}`);
            if (error instanceof InvalidateRefreshTokenError) {
                // notification service can be called here to alert user
                this.logger.warn(`Refresh token might have been stolen?`);
                throw new UnauthorizedException('Access denied');
            }
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    private async generateTokens(user: UserEntity) {
        const refreshTokenId = randomUUID();
        const [accessToken, refreshToken] = await Promise.all([
            this.signInToken<Partial<ActiveUserPayload>>(user.id, this.jwt.accessTokenTtl, {
                email: user.email,
                role: user.role,
            }),

            this.signInToken(user.id, this.jwt.refreshTokenTtl, {
                refreshTokenId,
            }),
        ]);

        await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);

        return { accessToken, refreshToken };
    }
    private async signInToken<T>(userId: number, expiresIn: number, payload?: T) {
        this.logger.log(`Attempting to generate token for user ${userId}`);
        return await this.jwtService.signAsync(
            {
                sub: userId,
                ...payload,
            },
            {
                audience: this.jwt.audience,
                issuer: this.jwt.issuer,
                expiresIn,
            },
        );
    }
}
