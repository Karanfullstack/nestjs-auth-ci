import { IsEmail, IsString } from 'class-validator';
// additional imports if necessary
export class CreateUserDto {
    @IsString({ message: 'Name must be a string' })
    name: string;

    @IsString({ message: 'Email must be a string' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsString({ message: 'Password must be a string' })
    password: string;
}
