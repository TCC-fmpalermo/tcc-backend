import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common';
import { DesktopsService } from './desktops.service';
import { CreateDesktopDto } from './dto/create-desktop.dto';
import { UpdateDesktopAliasDto } from './dto/update-desktop-alias.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request, Response } from 'express';
import { ProgressService } from 'src/progress/progress.service';
import { UpdateDesktopStatusDto } from './dto/update-desktop-status.dto';
import { Permissions as PermissionTypes } from 'src/permissions/role-and-permissions.config';
import { Permissions } from 'src/permissions/permissions.decorator';
import { RbacGuard } from 'src/auth/guards/rbac.guard';

@Controller('desktops')
@UseGuards(AuthGuard)
export class DesktopsController {
  constructor(
    private readonly desktopsService: DesktopsService,
    private readonly progressService: ProgressService
  ) {}

  @Post()
  create(@Req() request: Request, @Body() createDesktopDto: CreateDesktopDto) {
    return this.desktopsService.create(createDesktopDto, request.user);
  }
  
  @Get()
  @Permissions(PermissionTypes.VIEW_DESKTOPS)
  @UseGuards(RbacGuard)
  findAll() {
    return this.desktopsService.findAll();
  }

  @Get('mine')
  findUserDesktops(@Req() req: Request) {
    return this.desktopsService.findUserDesktops(req.user.id);
  }

  @Get('progress')
  async sendProgress(@Req() req: Request, @Res() res: Response) {
    const userId = req.user.id;
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    this.progressService.registerStream(+userId, res);

    req.on('close', () => {
      this.progressService.unregisterStream(+userId);
    });
  }

  @Get(':id/token')
  getGuacamoleToken(@Req() req: Request, @Param('id') id: string) {
    return this.desktopsService.getGuacamoleToken(+id, req.user);
  }

  @Patch(':id/alias')
  updateAlias(@Param('id') id: string, @Req() req: Request, @Body() updateDesktopAliasDto: UpdateDesktopAliasDto) {
    return this.desktopsService.updateAlias(+id, updateDesktopAliasDto, req.user.id);
  }

  @Patch(':id/status')
  @Permissions(PermissionTypes.EDIT_DESKTOP_REQUEST_STATUS)
  @UseGuards(RbacGuard)
  updateStatus(@Param('id') id: string, @Body() updateDesktopDto: UpdateDesktopStatusDto) {
    return this.desktopsService.updateStatus(+id, updateDesktopDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.desktopsService.remove(+id, req.user.id);
  }
}
