import { Injectable } from '@nestjs/common';
import { CreateVolumeDto } from './dto/create-volume.dto';
import { UpdateVolumeDto } from './dto/update-volume.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Volume } from './entities/volume.entity';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class VolumesService {
  constructor(
    @InjectRepository(Volume)
    private readonly volumeRepository: EntityRepository<Volume>,
    private readonly em: EntityManager
  ) {}

  async create(createVolumeDto: CreateVolumeDto) {
    const volume = this.volumeRepository.create(createVolumeDto);
    await this.em.persistAndFlush(volume);
    return volume;
  }

  findAll() {
    return this.volumeRepository.findAll();
  }

  findOne(id: number) {
    return this.em.findOne(Volume, id);
  }

  async update(id: number, updateVolumeDto: UpdateVolumeDto) {
    const volume = await this.findOne(id);
    if (!volume) return null;
    wrap(volume).assign(updateVolumeDto);
    await this.em.flush();
    return volume;
  }

  async remove(id: number) {
    const volume = this.em.getReference(Volume, id);
    if (!volume) throw new Error('Volume não encontrado');
    await this.em.removeAndFlush(volume);
    return volume;
  }
}
