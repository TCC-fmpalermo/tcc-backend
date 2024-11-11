import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CloudResourcesService } from './cloud-resources.service';
import { CreateCloudResourceDto } from './dto/create-cloud-resource.dto';
import { UpdateCloudResourceDto } from './dto/update-cloud-resource.dto';

@Controller('cloud-resources')
export class CloudResourcesController {
  constructor(private readonly cloudResourcesService: CloudResourcesService) {}

  @Post()
  create(@Body() createCloudResourceDto: CreateCloudResourceDto) {
    return this.cloudResourcesService.create(createCloudResourceDto);
  }

  @Get()
  findAll() {
    return this.cloudResourcesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cloudResourcesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCloudResourceDto: UpdateCloudResourceDto) {
    return this.cloudResourcesService.update(+id, updateCloudResourceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cloudResourcesService.remove(BigInt(id));
  }
}
