import { Injectable } from '@nestjs/common';
import { RolePermissions } from './role-and-permissions.config';
import { UserRoles } from 'src/users/entities/user.entity';

@Injectable()
export class PermissionsService {
  getPermissionsForRole(role: UserRoles): string[] {
    return RolePermissions[role] || [];
  }
}
