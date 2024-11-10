import { Injectable } from '@nestjs/common';
import { CreateCloudOptionDto } from './dto/create-cloud-option.dto';
import { UpdateCloudOptionDto } from './dto/update-cloud-option.dto';

@Injectable()
export class CloudOptionsService {
  create(createCloudOptionDto: CreateCloudOptionDto) {
    return 'This action adds a new cloudOption';
  }

  findAll() {
    return `This action returns all cloudOptions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cloudOption`;
  }

  update(id: number, updateCloudOptionDto: UpdateCloudOptionDto) {
    return `This action updates a #${id} cloudOption`;
  }

  remove(id: number) {
    return `This action removes a #${id} cloudOption`;
  }
}
