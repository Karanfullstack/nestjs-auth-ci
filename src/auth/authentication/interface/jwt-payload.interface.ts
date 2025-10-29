import { Role } from 'src/auth/authorization/enums/role.enum';

export interface ActiveUserPayload {
    sub: number;
    email: string;
    role: Role;
}
