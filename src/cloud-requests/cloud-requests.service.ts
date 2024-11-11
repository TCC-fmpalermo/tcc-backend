import { Injectable } from '@nestjs/common';
import { CreateCloudRequestDto } from './dto/create-cloud-request.dto';
import { UpdateCloudRequestDto } from './dto/update-cloud-request.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CloudRequest } from './entities/cloud-request.entity';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class CloudRequestsService {
  constructor(
    @InjectRepository(CloudRequest)
    private readonly cloudRequestRepository: EntityRepository<CloudRequest>,
    private readonly em: EntityManager
  ) {}

  async create(createCloudRequestDto: CreateCloudRequestDto) {
    const cloudRequest = this.cloudRequestRepository.create(createCloudRequestDto);
    await this.em.persistAndFlush(cloudRequest);
    return cloudRequest;
  }

  findAll() {
    return this.cloudRequestRepository.findAll();
  }

  findOne(id: number) {
    return this.em.findOne(CloudRequest, id);
  }

  async update(id: number, updateCloudRequestDto: UpdateCloudRequestDto) {
    const cloudRequest = await this.findOne(id);
    if (!cloudRequest) return null;
    wrap(cloudRequest).assign(updateCloudRequestDto);
    await this.em.flush();
    return cloudRequest;
  }

  async remove(id: bigint) {
    const cloudRequest = this.em.getReference(CloudRequest, id);
    if (!cloudRequest) return null;
    await this.em.removeAndFlush(cloudRequest);
    return cloudRequest;
  }
}
