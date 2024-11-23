import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateDesktopRequestDto } from './dto/create-desktop-request.dto';
import { UpdateDesktopRequestDto } from './dto/update-desktop-request.dto';
import { DesktopRequestsService } from './desktop-requests.service';

@Controller('desktop-requests')
export class DesktopRequestsController {
  constructor(private readonly desktopRequestsService: DesktopRequestsService) {}

  @Post()
  create(@Body() createDesktopRequestDto: CreateDesktopRequestDto) {
    return this.desktopRequestsService.create(createDesktopRequestDto);
  }

  @Get()
  findAll() {
    return this.desktopRequestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.desktopRequestsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDesktopRequestDto: UpdateDesktopRequestDto) {
    return this.desktopRequestsService.update(+id, updateDesktopRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.desktopRequestsService.remove(+id);
  }
}
