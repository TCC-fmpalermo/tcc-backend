import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Role } from './entities/role.entity';
import { EntityRepository } from '@mikro-orm/core';
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
    return await this.em.persistAndFlush(role);
  }

  findAll() {
    return this.roleRepository.findAll();
  }

  findOne(id: number) {
    return this.roleRepository.findOne(id);
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
