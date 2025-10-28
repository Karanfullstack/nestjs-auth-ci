import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user-dto/user.dto';
import { ActiveUser } from 'src/auth/authentication/decorators/active-user.decorator';
import { ActiveUserPayload } from 'src/auth/authentication/interface/jwt-payload.interface';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() payload: CreateUserDto) {
        return await this.userService.createUser(payload);
    }

    @Get()
    async getUsers(@ActiveUser() user: ActiveUserPayload) {
        console.log(user.email);
        return 'success';
    }
}
