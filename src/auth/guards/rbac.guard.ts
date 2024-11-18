import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { hasPermission } from 'src/utils/rbac.util';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );
    if (!requiredPermissions) return true;

    const request = context.switchToHttp().getRequest();
    
    const user = request.user;

    const isAuthorized = requiredPermissions.every((permission) =>
      hasPermission(user.role, permission),
    );

    if(!isAuthorized) {
      throw new ForbiddenException('Você não tem permissão para acessar esse recurso');
    }

    return true;
  }
}
