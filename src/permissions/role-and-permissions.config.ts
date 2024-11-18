import { UserRoles } from "src/users/entities/user.entity";

export const Roles = {
    ADMIN: 'admin',
    USER: 'user',
};

export const RolesDisplay: Record<UserRoles, string> = {
    [UserRoles.USER]: 'Usuário',
    [UserRoles.ADMIN]: 'Administrador',
  };
  
export const Permissions = {
CREATE_USER: 'create_user',
VIEW_USERS: 'view_users',
// EDIT_PROFILE: 'edit_profile',
// CHANGE_STATUS: 'change_status',
};

export const RolePermissions: Record<string, string[]> = {
[Roles.ADMIN]: [
    Permissions.CREATE_USER,
    Permissions.VIEW_USERS,
],
[Roles.USER]: [],
};
  