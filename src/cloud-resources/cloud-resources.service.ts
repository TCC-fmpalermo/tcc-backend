import { Injectable } from '@nestjs/common';
import { CreateCloudResourceDto } from './dto/create-cloud-resource.dto';
import { UpdateCloudResourceDto } from './dto/update-cloud-resource.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CloudResource } from './entities/cloud-resource.entity';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class CloudResourcesService {
  constructor(
    @InjectRepository(CloudResource)
    private readonly cloudResourceRepository: EntityRepository<CloudResource>,
    private readonly em: EntityManager
  ) {}

  async create(createCloudResourceDto: CreateCloudResourceDto) {
    const cloudResource = this.cloudResourceRepository.create(createCloudResourceDto);
    await this.em.persistAndFlush(cloudResource);
    return cloudResource;
  }

  findAll() {
    return this.cloudResourceRepository.findAll();
  }

  findOne(id: number) {
    return this.em.findOne(CloudResource, id);
  }

  async update(id: number, updateCloudResourceDto: UpdateCloudResourceDto) {
    const cloudResource = await this.findOne(id);
    if (!cloudResource) return null;
    wrap(cloudResource).assign(updateCloudResourceDto);
    await this.em.flush();
    return cloudResource;
  }

  async remove(id: bigint) {
    const cloudResource = this.em.getReference(CloudResource, id);
    if (!cloudResource) return null;
    await this.em.removeAndFlush(cloudResource);
    return cloudResource;
  }
}
