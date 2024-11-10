import { Injectable } from '@nestjs/common';
import { CreateInstanceDto } from './dto/create-instance.dto';
import { UpdateInstanceDto } from './dto/update-instance.dto';

@Injectable()
export class InstancesService {
  create(createInstanceDto: CreateInstanceDto) {
    return 'This action adds a new instance';
  }

  findAll() {
    return `This action returns all instances`;
  }

  findOne(id: number) {
    return `This action returns a #${id} instance`;
  }

  update(id: number, updateInstanceDto: UpdateInstanceDto) {
    return `This action updates a #${id} instance`;
  }

  remove(id: number) {
    return `This action removes a #${id} instance`;
  }
}
