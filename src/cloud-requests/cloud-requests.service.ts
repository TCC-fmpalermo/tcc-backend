import { Injectable } from '@nestjs/common';
import { CreateCloudRequestDto } from './dto/create-cloud-request.dto';
import { UpdateCloudRequestDto } from './dto/update-cloud-request.dto';

@Injectable()
export class CloudRequestsService {
  create(createCloudRequestDto: CreateCloudRequestDto) {
    return 'This action adds a new cloudRequest';
  }

  findAll() {
    return `This action returns all cloudRequests`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cloudRequest`;
  }

  update(id: number, updateCloudRequestDto: UpdateCloudRequestDto) {
    return `This action updates a #${id} cloudRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} cloudRequest`;
  }
}
