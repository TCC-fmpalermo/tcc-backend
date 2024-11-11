import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Permission } from './entities/permission.entity';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: EntityRepository<Permission>,
    private readonly em: EntityManager
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    const permission = this.permissionRepository.create(createPermissionDto);
    await this.em.persistAndFlush(permission);
    return permission;
  }

  findAll() {
    return this.permissionRepository.findAll();
  }

  findOne(id: number) {
    return this.em.findOne(Permission, id);
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.findOne(id);
    if (!permission) return null;
    wrap(permission).assign(updatePermissionDto);
    await this.em.flush();
    return permission;
  }

  async remove(id: bigint) {
    const permission = this.em.getReference(Permission, id);
    if (!permission) return null;
    await this.em.removeAndFlush(permission);
    return permission;
  }
}
