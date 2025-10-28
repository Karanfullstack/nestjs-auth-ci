import { IsEmail, MinLength } from 'class-validator';

export class SignInDto {
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @MinLength(3)
    password: string;
}
