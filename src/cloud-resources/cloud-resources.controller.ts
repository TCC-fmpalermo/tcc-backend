import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common';
import { CloudResourcesService } from './cloud-resources.service';
import { CreateCloudResourceDto } from './dto/create-cloud-resource.dto';
import { UpdateCloudResourceAliasDto } from './dto/update-cloud-resource-alias.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request, Response } from 'express';
import { ProgressService } from 'src/progress/progress.service';
import { UpdateCloudResourceStatusDto } from './dto/update-cloud-resource-status.dto';
import { Permissions as PermissionTypes } from 'src/permissions/role-and-permissions.config';
import { Permissions } from 'src/permissions/permissions.decorator';
import { RbacGuard } from 'src/auth/guards/rbac.guard';

@Controller('cloud-resources')
@UseGuards(AuthGuard)
export class CloudResourcesController {
  constructor(
    private readonly cloudResourcesService: CloudResourcesService,
    private readonly progressService: ProgressService
  ) {}

  @Post()
  create(@Req() request: Request, @Body() createCloudResourceDto: CreateCloudResourceDto) {
    return this.cloudResourcesService.create(createCloudResourceDto, request.user);
  }
  
  @Get()
  @Permissions(PermissionTypes.VIEW_CLOUD_RESOURCES)
  @UseGuards(RbacGuard)
  findAll() {
    return this.cloudResourcesService.findAll();
  }

  @Get('mine')
  findUserCloudResources(@Req() req: Request) {
    return this.cloudResourcesService.findUserCloudResources(req.user.id);
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
    return this.cloudResourcesService.getGuacamoleToken(+id, req.user);
  }

  @Patch(':id/alias')
  updateAlias(@Param('id') id: string, @Req() req: Request, @Body() updateCloudResourceAliasDto: UpdateCloudResourceAliasDto) {
    return this.cloudResourcesService.updateAlias(+id, updateCloudResourceAliasDto, req.user.id);
  }

  @Patch(':id/status')
  @Permissions(PermissionTypes.EDIT_DESKTOP_REQUEST_STATUS)
  @UseGuards(RbacGuard)
  updateStatus(@Param('id') id: string, @Body() updateCloudResourceDto: UpdateCloudResourceStatusDto) {
    return this.cloudResourcesService.updateStatus(+id, updateCloudResourceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.cloudResourcesService.remove(+id, req.user.id);
  }
}
