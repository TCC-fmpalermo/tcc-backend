import { Injectable } from '@nestjs/common';
import { CreateCloudOptionDto } from './dto/create-cloud-option.dto';
import { UpdateCloudOptionDto } from './dto/update-cloud-option.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CloudOption } from './entities/cloud-option.entity';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class CloudOptionsService {
  constructor(
    @InjectRepository(CloudOption)
    private readonly cloudOptionRepository: EntityRepository<CloudOption>,
    private readonly em: EntityManager
  ) {}

  async create(createCloudOptionDto: CreateCloudOptionDto) {
    const cloudOption = this.cloudOptionRepository.create(createCloudOptionDto);
    await this.em.persistAndFlush(cloudOption);
    return cloudOption;
  }

  findAll() {
    return this.cloudOptionRepository.findAll();
  }

  findOne(id: number) {
    return this.em.findOne(CloudOption, id);
  }

  async update(id: number, updateCloudOptionDto: UpdateCloudOptionDto) {
    const cloudOption = await this.findOne(id);
    if (!cloudOption) return null;
    wrap(cloudOption).assign(updateCloudOptionDto);
    await this.em.flush();
    return cloudOption;
  }

  async remove(id: number) {
    const cloudOption = this.em.getReference(CloudOption, id);
    if (!cloudOption) return null;
    await this.em.removeAndFlush(cloudOption);
    return cloudOption;
  }
}
