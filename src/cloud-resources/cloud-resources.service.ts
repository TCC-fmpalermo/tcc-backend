import { Injectable } from '@nestjs/common';
import { CreateCloudResourceDto } from './dto/create-cloud-resource.dto';
import { UpdateCloudResourceDto } from './dto/update-cloud-resource.dto';

@Injectable()
export class CloudResourcesService {
  create(createCloudResourceDto: CreateCloudResourceDto) {
    return 'This action adds a new cloudResource';
  }

  findAll() {
    return `This action returns all cloudResources`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cloudResource`;
  }

  update(id: number, updateCloudResourceDto: UpdateCloudResourceDto) {
    return `This action updates a #${id} cloudResource`;
  }

  remove(id: number) {
    return `This action removes a #${id} cloudResource`;
  }
}
