import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CreateDesktopOptionDto } from './dto/create-desktop-option.dto';
import { UpdateDesktopOptionDto } from './dto/update-desktop-option.dto';
import { DesktopOptionsService } from './desktop-options.service';
import { GetDesktopOptionDto } from './dto/get-desktop-option.dto';

@Controller('desktop-options')
export class DesktopOptionsController {
  constructor(private readonly desktopOptionsService: DesktopOptionsService) {}

  @Post()
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.desktopOptionsService.findOne(+id);
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
