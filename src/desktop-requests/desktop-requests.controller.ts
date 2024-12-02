import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { CreateDesktopRequestDto } from './dto/create-desktop-request.dto';
import { UpdateDesktopRequestDto } from './dto/update-desktop-request-status.dto';
import { DesktopRequestsService } from './desktop-requests.service';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetDesktopRequestDto } from './dto/get-desktop-request.dto';

@Controller('desktop-requests')
@UseGuards(AuthGuard)
export class DesktopRequestsController {
  constructor(private readonly desktopRequestsService: DesktopRequestsService) {}

  @Post()
  create(@Body() createDesktopRequestDto: CreateDesktopRequestDto, @Req() request: Request) {
    return this.desktopRequestsService.create(createDesktopRequestDto, request.user);
  }

  @Get()
  findAll(@Query() filters: GetDesktopRequestDto) {
    return this.desktopRequestsService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.desktopRequestsService.findOne(+id);
  }

  @Patch(':id/update-status')
  updateStatus(@Param('id') id: string, @Body() updateDesktopRequestDto: UpdateDesktopRequestDto) {
    return this.desktopRequestsService.updateStatus(+id, updateDesktopRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.desktopRequestsService.remove(+id);
  }
}
