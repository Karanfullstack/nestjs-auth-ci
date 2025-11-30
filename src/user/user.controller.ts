import { Body, Controller, Get, Post } from '@nestjs/common';
import { ActiveUser } from 'src/auth/authentication/decorators/active-user.decorator';
import { ActiveUserPayload } from 'src/auth/authentication/interface/jwt-payload.interface';
import { CreateUserDto } from './user-dto/user.dto';
import { UserService } from './user.service';
import { Permissions } from 'src/auth/claim-based/claim-based.decorator';
import { PermissionsOptions } from 'src/auth/claim-based/enums/claim-based.enum';
import { Auth } from 'src/auth/authentication/decorators/auth.decorator';
import { AuthType } from 'src/auth/authentication/enums/auth-type.enum';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Permissions(PermissionsOptions.CREATE_USER)
    @Post()
    async create(@Body() payload: CreateUserDto) {
        return await this.userService.createUser(payload);
    }

    @Get()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async getUsers(@ActiveUser() user: ActiveUserPayload) {
        const users = await this.userService.getAllUsers();
        return users;
    }

    @Auth(AuthType.None)
    @Get('/health')
    async healthCheck() {
        return { health: true, version: 'v4', host: process.env.NODE_HOST || 'not-found' };
    }
}
