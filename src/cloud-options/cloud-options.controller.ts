import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CloudOptionsService } from './cloud-options.service';
import { CreateCloudOptionDto } from './dto/create-cloud-option.dto';
import { UpdateCloudOptionDto } from './dto/update-cloud-option.dto';

@Controller('cloud-options')
export class CloudOptionsController {
  constructor(private readonly cloudOptionsService: CloudOptionsService) {}

  @Post()
  create(@Body() createCloudOptionDto: CreateCloudOptionDto) {
    return this.cloudOptionsService.create(createCloudOptionDto);
  }

  @Get()
  findAll() {
    return this.cloudOptionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cloudOptionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCloudOptionDto: UpdateCloudOptionDto) {
    return this.cloudOptionsService.update(+id, updateCloudOptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cloudOptionsService.remove(BigInt(id));
  }
}
