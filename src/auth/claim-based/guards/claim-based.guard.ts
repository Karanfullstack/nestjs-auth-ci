import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PermissionsOptions } from '../enums/claim-based.enum';
import { PERMISSION_KEY } from '../claim-based.decorator';
import { USER_REQUEST } from 'src/auth/const/request-user';
import { ActiveUserPayload } from 'src/auth/authentication/interface/jwt-payload.interface';

@Injectable()
export class Permission implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const user = context.switchToHttp().getRequest()[USER_REQUEST] as ActiveUserPayload;
        const policies = this.reflector.getAllAndOverride<PermissionsOptions[]>(PERMISSION_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!policies) {
            return true;
        }
        return user.permissions.every((permission) => policies.includes(permission));
    }
}
