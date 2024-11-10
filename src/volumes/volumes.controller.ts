import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VolumesService } from './volumes.service';
import { CreateVolumeDto } from './dto/create-volume.dto';
import { UpdateVolumeDto } from './dto/update-volume.dto';

@Controller('volumes')
export class VolumesController {
  constructor(private readonly volumesService: VolumesService) {}

  @Post()
  create(@Body() createVolumeDto: CreateVolumeDto) {
    return this.volumesService.create(createVolumeDto);
  }

  @Get()
  findAll() {
    return this.volumesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.volumesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVolumeDto: UpdateVolumeDto) {
    return this.volumesService.update(+id, updateVolumeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.volumesService.remove(+id);
  }
}
