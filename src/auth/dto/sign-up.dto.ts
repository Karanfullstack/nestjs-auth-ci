import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignUpDto {
    @IsString({ message: 'Name must be a string' })
    name: string;

    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @MinLength(3, { message: 'Password must be at least 3 characters long' })
    password: string;
}
