import { SetMetadata } from '@nestjs/common';
import { PermissionsOptions } from './enums/claim-based.enum';

export const PERMISSION_KEY = 'policy';

export const Permissions = (...permissions: PermissionsOptions[]) =>
    SetMetadata(PERMISSION_KEY, permissions);
