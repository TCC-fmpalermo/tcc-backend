import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CloudRequestsService } from './cloud-requests.service';
import { CreateCloudRequestDto } from './dto/create-cloud-request.dto';
import { UpdateCloudRequestDto } from './dto/update-cloud-request.dto';

@Controller('cloud-requests')
export class CloudRequestsController {
  constructor(private readonly cloudRequestsService: CloudRequestsService) {}

  @Post()
  create(@Body() createCloudRequestDto: CreateCloudRequestDto) {
    return this.cloudRequestsService.create(createCloudRequestDto);
  }

  @Get()
  findAll() {
    return this.cloudRequestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cloudRequestsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCloudRequestDto: UpdateCloudRequestDto) {
    return this.cloudRequestsService.update(+id, updateCloudRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cloudRequestsService.remove(+id);
  }
}
