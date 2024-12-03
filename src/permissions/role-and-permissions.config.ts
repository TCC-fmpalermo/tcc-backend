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
    CREATE_USER: 'CREATE_USER',
    VIEW_USERS: 'VIEW_USERS',
    EDIT_USERS: 'EDIT_USERS',
    MANAGE_USERS: 'MANAGE_USERS',
    VIEW_DESKTOP_REQUESTS: 'VIEW_DESKTOP_REQUESTS',
    VIEW_MY_DESKTOP_REQUESTS: 'VIEW_MY_DESKTOP_REQUESTS',
    MANAGE_DESKTOP_REQUESTS: 'MANAGE_DESKTOP_REQUESTS',
    EDIT_DESKTOP_REQUEST_STATUS: 'EDIT_DESKTOP_REQUEST_STATUS',
    CREATE_DESKTOP_OPTION: 'CREATE_DESKTOP_OPTION',
    MANAGE_DESKTOP_OPTIONS: 'MANAGE_DESKTOP_OPTIONS',
    CREATE_ANY_CLOUD_RESOURCE: 'CREATE_ANY_CLOUD_RESOURCE',
    VIEW_CLOUD_RESOURCES: 'VIEW_CLOUD_RESOURCES',
    MANAGE_CLOUD_RESOURCES: 'MANAGE_CLOUD_RESOURCES',
    EDIT_CLOUD_RESOURCE_STATUS: 'EDIT_CLOUD_RESOURCE_STATUS',
};

export const RolePermissions: Record<string, string[]> = {
[Roles.ADMIN]: [
    Permissions.CREATE_USER,
    Permissions.VIEW_USERS,
    Permissions.EDIT_USERS,
    Permissions.MANAGE_USERS,
    Permissions.VIEW_DESKTOP_REQUESTS,
    Permissions.MANAGE_DESKTOP_REQUESTS,
    Permissions.EDIT_DESKTOP_REQUEST_STATUS,
    Permissions.CREATE_DESKTOP_OPTION,
    Permissions.MANAGE_DESKTOP_OPTIONS,
    Permissions.CREATE_ANY_CLOUD_RESOURCE,
    Permissions.VIEW_CLOUD_RESOURCES,
    Permissions.MANAGE_CLOUD_RESOURCES,
    Permissions.EDIT_CLOUD_RESOURCE_STATUS
],
[Roles.USER]: [
    Permissions.VIEW_MY_DESKTOP_REQUESTS,
],
};
  