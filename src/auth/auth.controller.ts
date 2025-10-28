import { Body, Controller, HttpCode, HttpStatus, Logger, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Auth } from './authentication/decorators/auth.decorator';
import { AuthType } from './authentication/enums/auth-type.enum';
import { CookieOptions, Response } from 'express';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { COOKIE_OPTIONS } from './const/cookie-options';

@Auth(AuthType.None)
@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);
    constructor(private readonly authService: AuthService) {}

    @Post('sign-up')
    async signUp(@Body() signUpDto: SignUpDto) {
        this.logger.log(`POST /auth/sign-up - dto: ${JSON.stringify(signUpDto)}`);
        return await this.authService.signUp(signUpDto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('sign-in')
    async signIn(@Res({ passthrough: true }) res: Response, @Body() signInDto: SignInDto) {
        this.logger.log(`POST /auth/sign-in - dto: ${JSON.stringify(signInDto)}`);

        const token = await this.authService.signIn(signInDto);

        const cookieOptions = COOKIE_OPTIONS as CookieOptions;
        res.cookie('AccessToken', token.accessToken, cookieOptions).cookie(
            'RefreshToken',
            token.refreshToken,
            cookieOptions,
        );
        return token;
    }

    @HttpCode(HttpStatus.OK)
    @Post('refresh-token')
    async refreshToken(
        @Res({ passthrough: true }) res: Response,
        @Body() refreshTokenDto: RefreshTokenDto,
    ) {
        this.logger.log(`POST /auth/refresh-token - dto: ${JSON.stringify(refreshTokenDto)}`);
        const tokens = await this.authService.refreshToken(refreshTokenDto);
        const cookieOptions = COOKIE_OPTIONS as CookieOptions;
        res.cookie('AccessToken', tokens.accessToken, cookieOptions).cookie(
            'RefreshToken',
            tokens.refreshToken,
            cookieOptions,
        );
        return tokens;
    }
}
