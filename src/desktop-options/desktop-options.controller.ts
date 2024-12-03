import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CreateDesktopOptionDto } from './dto/create-desktop-option.dto';
import { UpdateDesktopOptionDto } from './dto/update-desktop-option.dto';
import { DesktopOptionsService } from './desktop-options.service';
import { GetDesktopOptionDto } from './dto/get-desktop-option.dto';
import { Permissions as PermissionTypes } from 'src/permissions/role-and-permissions.config';
import { Permissions } from 'src/permissions/permissions.decorator';
import { RbacGuard } from 'src/auth/guards/rbac.guard';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('desktop-options')
@UseGuards(AuthGuard)
export class DesktopOptionsController {
  constructor(private readonly desktopOptionsService: DesktopOptionsService) {}

  @Post()
  @Permissions(PermissionTypes.CREATE_DESKTOP_OPTION)
  @UseGuards(RbacGuard)
  create(@Body() createDesktopOptionDto: CreateDesktopOptionDto) {
    return this.desktopOptionsService.create(createDesktopOptionDto);
  }

  @Get()
  findAll(@Query() filters: GetDesktopOptionDto) {
    return this.desktopOptionsService.findAll(filters);
  }

  @Get('/images')
  findAllImages() {
    return this.desktopOptionsService.findAllImages();
  }

  @Get('/flavors')
  findAllFlavors() {
    return this.desktopOptionsService.findAllFlavors();
  }

  @Get('/status/all')
  findAllStatus() {
    return this.desktopOptionsService.findAllStatus();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDesktopOptionDto: UpdateDesktopOptionDto) {
    return this.desktopOptionsService.update(+id, updateDesktopOptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.desktopOptionsService.remove(+id);
  }
}
