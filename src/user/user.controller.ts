import { Body, Controller, Get, Post } from '@nestjs/common';
import { ActiveUser } from 'src/auth/authentication/decorators/active-user.decorator';
import { ActiveUserPayload } from 'src/auth/authentication/interface/jwt-payload.interface';
import { CreateUserDto } from './user-dto/user.dto';
import { UserService } from './user.service';
import { Permissions } from 'src/auth/claim-based/claim-based.decorator';
import { PermissionsOptions } from 'src/auth/claim-based/enums/claim-based.enum';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Permissions(PermissionsOptions.CREATE_USER)
    @Post()
    async create(@Body() payload: CreateUserDto) {
        return await this.userService.createUser(payload);
    }

    @Get()
    async getUsers(@ActiveUser() user: ActiveUserPayload) {
        const users = await this.userService.getAllUsers();
        return users;
    }
}
