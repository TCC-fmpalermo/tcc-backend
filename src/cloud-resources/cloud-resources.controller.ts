import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CloudResourcesService } from './cloud-resources.service';
import { CreateCloudResourceDto } from './dto/create-cloud-resource.dto';
import { UpdateCloudResourceDto } from './dto/update-cloud-resource.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('cloud-resources')
@UseGuards(AuthGuard)
export class CloudResourcesController {
  constructor(private readonly cloudResourcesService: CloudResourcesService) {}

  @Post()
  create(@Req() request, @Body() createCloudResourceDto: CreateCloudResourceDto) {
    return this.cloudResourcesService.create(createCloudResourceDto, request.user);
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
    return this.cloudResourcesService.remove(+id);
  }
}
