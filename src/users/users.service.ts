import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { RolesService } from 'src/roles/roles.service';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly roleService: RolesService,
    private readonly em: EntityManager
  ) {}

  async create(createUserDto: CreateUserDto) {    
    // Busca o role    
    const role = await this.roleService.findOne(createUserDto.roleId);
    if (!role) {
      throw new NotFoundException('Função não encontrada');
    }

    const isEmailUnique = await this.findOneByEmail(createUserDto.email);
    if (isEmailUnique) {
      throw new BadRequestException('E-mail já cadastrado');
    }
    
    //Cria o usuário e associa o role
    const user = this.userRepository.create({
      ...createUserDto,
      role: role.id,
      password: await argon2.hash(createUserDto.password),
    });
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

  async findOneByEmail(email: string) {
    return this.em.findOne(User, { email }, { populate: ['role', 'role.permissions'] });
  }
}
