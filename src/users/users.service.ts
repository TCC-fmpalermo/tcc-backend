import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);
    await this.em.persistAndFlush(user);
    return user;
  }

  findAll() {
    return this.userRepository.findAll();
  }

  findOne(id: number) {
    return this.em.findOne(User, id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) return null;
    wrap(user).assign(updateUserDto);
    await this.em.flush();
    return user;
  }

  async remove(id: bigint) {
    const user = this.em.getReference(User, id);
    if (!user) return null;
    await this.em.removeAndFlush(user);
    return user;
  }
}
