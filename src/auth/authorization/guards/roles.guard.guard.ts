import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.docorator';
import { USER_REQUEST } from 'src/auth/const/request-user';
import { ActiveUserPayload } from 'src/auth/authentication/interface/jwt-payload.interface';
import { Role } from '../enums/role.enum';

@Injectable()
export class RolesGuardGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const _role = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!_role) {
            return true;
        }
        const user = context.switchToHttp().getRequest()[USER_REQUEST] as ActiveUserPayload;
        return _role.some((role) => user.role === role);
    }
}
