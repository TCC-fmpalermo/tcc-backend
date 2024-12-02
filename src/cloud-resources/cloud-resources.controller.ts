import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res, Query } from '@nestjs/common';
import { CloudResourcesService } from './cloud-resources.service';
import { CreateCloudResourceDto } from './dto/create-cloud-resource.dto';
import { UpdateCloudResourceDto } from './dto/update-cloud-resource.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request, Response } from 'express';
import { ProgressService } from 'src/progress/progress.service';
import { UpdateCloudResourceStatusDto } from './dto/update-cloud-resource-status.dto';

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCloudResourceDto: UpdateCloudResourceDto) {
    return this.cloudResourcesService.update(+id, updateCloudResourceDto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() updateCloudResourceDto: UpdateCloudResourceStatusDto) {
    return this.cloudResourcesService.updateStatus(+id, updateCloudResourceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.cloudResourcesService.remove(+id, req.user.id);
  }
}
