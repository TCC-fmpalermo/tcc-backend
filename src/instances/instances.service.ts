import { Injectable } from '@nestjs/common';
import { CreateInstanceDto } from './dto/create-instance.dto';
import { UpdateInstanceDto } from './dto/update-instance.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Instance } from './entities/instance.entity';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class InstancesService {
  constructor(
    @InjectRepository(Instance)
    private readonly instanceRepository: EntityRepository<Instance>,
    private readonly em: EntityManager
  ) {}

  async create(createInstanceDto: CreateInstanceDto) {
    const instance = this.instanceRepository.create(createInstanceDto);
    await this.em.persistAndFlush(instance);
    return instance;
  }

  findAll() {
    return this.instanceRepository.findAll();
  }

  findOne(id: number) {
    return this.em.findOne(Instance, id);
  }

  async update(id: number, updateInstanceDto: UpdateInstanceDto) {
    const instance = await this.findOne(id);
    if (!instance) return null;
    wrap(instance).assign(updateInstanceDto);
    await this.em.flush();
    return instance;
  }

  async remove(id: bigint) {
    const instance = this.em.getReference(Instance, id);
    if (!instance) return null;
    await this.em.removeAndFlush(instance);
    return instance;
  }
}
