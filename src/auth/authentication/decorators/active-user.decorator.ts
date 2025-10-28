import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { USER_REQUEST } from 'src/auth/const/request-user';
import { ActiveUserPayload } from '../interface/jwt-payload.interface';

export const ActiveUser = createParamDecorator(
    (field: keyof ActiveUserPayload | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user: ActiveUserPayload | undefined = request[USER_REQUEST];
        return field ? user[field] : user;
    },
);
