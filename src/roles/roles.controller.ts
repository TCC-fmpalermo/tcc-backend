import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesService } from './roles.service';

@Controller('roles')
@UseGuards(AuthGuard)
export class RolesController {
    constructor(private rolesService: RolesService) {}
    @Get()
    getPermissions() {
      return this.rolesService.getRoles();
    }
}
