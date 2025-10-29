import { SetMetadata } from '@nestjs/common';
import { AuthType } from '../enums/auth-type.enum';

export const Auth_Type_key = 'AuthType';

// Custom @Auth decorator to specify authentication types example @Auth(AuthType.BEARER)
export const Auth = (...authType: AuthType[]) => SetMetadata(Auth_Type_key, authType);
