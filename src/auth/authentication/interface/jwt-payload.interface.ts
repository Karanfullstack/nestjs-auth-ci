import { Role } from 'src/auth/authorization/enums/role.enum';
import { PermissionsOptions } from 'src/auth/claim-based/enums/claim-based.enum';

export interface ActiveUserPayload {
    sub: number;
    email: string;
    role: Role;
    permissions: PermissionsOptions[];
}
