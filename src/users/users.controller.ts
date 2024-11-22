import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Permissions } from 'src/permissions/permissions.decorator';
import { Permissions as PermissionTypes } from 'src/permissions/role-and-permissions.config';
import { RbacGuard } from 'src/auth/guards/rbac.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUsersDto } from './dto/get-users.dto';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Permissions(PermissionTypes.CREATE_USER) // Necessita da permissão 'create_user'
  @UseGuards(RbacGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Permissions(PermissionTypes.VIEW_USERS) // Necessita da permissão 'create_user'
  @UseGuards(RbacGuard)
  findAll(@Query() filters: GetUsersDto) {
    return this.usersService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Get('status/all')
  findAllStatus() {
    return this.usersService.findAllStatus();
  }
}
