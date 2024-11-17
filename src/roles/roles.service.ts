import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Role } from './entities/role.entity';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: EntityRepository<Role>,
    private readonly em: EntityManager
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto);
    await this.em.persistAndFlush(role);
    return role;
  }

  findAll() {
    return this.roleRepository.findAll();
  }

  findOne(id: number) {
    return this.em.findOne(Role, id);
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);
    if (!role) return null;
    wrap(role).assign(updateRoleDto);
    await this.em.flush();
    return role;
  }

  async remove(id: number) {
    const role = this.em.getReference(Role, id);
    if (!role) return null;
    await this.em.removeAndFlush(role);
    return role;
  }
}
