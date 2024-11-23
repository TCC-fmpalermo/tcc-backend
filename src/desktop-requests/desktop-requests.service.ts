import { Injectable } from '@nestjs/common';
import { CreateDesktopRequestDto } from './dto/create-desktop-request.dto';
import { UpdateDesktopRequestDto } from './dto/update-desktop-request.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { DesktopRequest } from './entities/desktop-request.entity';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class DesktopRequestsService {
  constructor(
    @InjectRepository(DesktopRequest)
    private readonly desktopRequestRepository: EntityRepository<DesktopRequest>,
    private readonly em: EntityManager
  ) {}

  async create(createDesktopRequestDto: CreateDesktopRequestDto) {
    const desktopRequest = this.desktopRequestRepository.create(createDesktopRequestDto);
    await this.em.persistAndFlush(desktopRequest);
    return desktopRequest;
  }

  findAll() {
    return this.desktopRequestRepository.findAll();
  }

  findOne(id: number) {
    return this.em.findOne(DesktopRequest, id);
  }

  async update(id: number, updateDesktopRequestDto: UpdateDesktopRequestDto) {
    const desktopRequest = await this.findOne(id);
    if (!desktopRequest) return null;
    wrap(desktopRequest).assign(updateDesktopRequestDto);
    await this.em.flush();
    return desktopRequest;
  }

  async remove(id: number) {
    const desktopRequest = this.em.getReference(DesktopRequest, id);
    if (!desktopRequest) return null;
    await this.em.removeAndFlush(desktopRequest);
    return desktopRequest;
  }
}
