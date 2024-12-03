import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { CreateDesktopRequestDto } from './dto/create-desktop-request.dto';
import { UpdateDesktopRequestDto } from './dto/update-desktop-request-status.dto';
import { DesktopRequestsService } from './desktop-requests.service';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetDesktopRequestDto } from './dto/get-desktop-request.dto';
import { Permissions as PermissionTypes } from 'src/permissions/role-and-permissions.config';
import { Permissions } from 'src/permissions/permissions.decorator';
import { RbacGuard } from 'src/auth/guards/rbac.guard';

@Controller('desktop-requests')
@UseGuards(AuthGuard)
export class DesktopRequestsController {
  constructor(private readonly desktopRequestsService: DesktopRequestsService) {}

  @Post()
  create(@Body() createDesktopRequestDto: CreateDesktopRequestDto, @Req() request: Request) {
    return this.desktopRequestsService.create(createDesktopRequestDto, request.user);
  }

  @Get()
  @Permissions(PermissionTypes.VIEW_DESKTOP_REQUESTS)
  @UseGuards(RbacGuard)
  findAll(@Query() filters: GetDesktopRequestDto) {
    return this.desktopRequestsService.findAll(filters);
  }

  @Get('/mine')
  findUserDesktopRequests(@Req() request: Request) {
    return this.desktopRequestsService.findUserDesktopRequests(request.user.id);
  }

  @Patch(':id/update-status')
  @Permissions(PermissionTypes.EDIT_DESKTOP_REQUEST_STATUS)
  @UseGuards(RbacGuard)
  updateStatus(@Param('id') id: string, @Body() updateDesktopRequestDto: UpdateDesktopRequestDto) {
    return this.desktopRequestsService.updateStatus(+id, updateDesktopRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    return this.desktopRequestsService.remove(+id, request.user.id);
  }
}
