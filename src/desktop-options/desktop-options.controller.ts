import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateDesktopOptionDto } from './dto/create-desktop-option.dto';
import { UpdateDesktopOptionDto } from './dto/update-desktop-option.dto';
import { DesktopOptionsService } from './desktop-options.service';

@Controller('desktop-options')
export class DesktopOptionsController {
  constructor(private readonly desktopOptionsService: DesktopOptionsService) {}

  @Post()
  create(@Body() createDesktopOptionDto: CreateDesktopOptionDto) {
    console.log(createDesktopOptionDto);
    
    return this.desktopOptionsService.create(createDesktopOptionDto);
  }

  @Get()
  findAll() {
    return this.desktopOptionsService.findAll();
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
