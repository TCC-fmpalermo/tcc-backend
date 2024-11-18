import { RolePermissions } from "src/permissions/role-and-permissions.config";

export function hasPermission(role: string, permission: string): boolean {
  return RolePermissions[role]?.includes(permission) ?? false;
}
