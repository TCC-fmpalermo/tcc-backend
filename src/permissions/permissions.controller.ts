import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PermissionsService } from './permissions.service';
import { Request } from 'express';

@Controller('permissions')
@UseGuards(AuthGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  getPermissions(@Req() req: Request) {
    const user = req.user;
    return this.permissionsService.getPermissionsForRole(user.role);
  }
}
