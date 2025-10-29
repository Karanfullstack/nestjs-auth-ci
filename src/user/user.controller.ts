import { Body, Controller, Get, Post } from '@nestjs/common';
import { ActiveUser } from 'src/auth/authentication/decorators/active-user.decorator';
import { ActiveUserPayload } from 'src/auth/authentication/interface/jwt-payload.interface';
import { Roles } from 'src/auth/authorization/decorators/roles.docorator';
import { Role } from 'src/auth/authorization/enums/role.enum';
import { CreateUserDto } from './user-dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() payload: CreateUserDto) {
        return await this.userService.createUser(payload);
    }

    @Roles(Role.ADMIN)
    @Get()
    async getUsers(@ActiveUser() user: ActiveUserPayload) {
        const users = await this.userService.getAllUsers();
        return users;
    }
}
