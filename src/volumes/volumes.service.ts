import { Injectable } from '@nestjs/common';
import { CreateVolumeDto } from './dto/create-volume.dto';
import { UpdateVolumeDto } from './dto/update-volume.dto';

@Injectable()
export class VolumesService {
  create(createVolumeDto: CreateVolumeDto) {
    return 'This action adds a new volume';
  }

  findAll() {
    return `This action returns all volumes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} volume`;
  }

  update(id: number, updateVolumeDto: UpdateVolumeDto) {
    return `This action updates a #${id} volume`;
  }

  remove(id: number) {
    return `This action removes a #${id} volume`;
  }
}
