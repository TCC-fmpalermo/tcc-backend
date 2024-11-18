import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import * as argon2 from 'argon2';
import * as dayjs from "dayjs";
import { GetUsersDto } from './dto/get-users.dto';
import { RolesDisplay } from 'src/permissions/role-and-permissions.config';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly em: EntityManager
  ) {}

  async create(createUserDto: CreateUserDto) {    
    const isEmailUnique = await this.findOneByEmail(createUserDto.email);
    if (isEmailUnique) {
      throw new BadRequestException('E-mail já cadastrado');
    }
    
    //Cria o usuário e associa o role
    const user = this.userRepository.create({
      ...createUserDto,
      password: await argon2.hash(createUserDto.password),
    });
    await this.em.persistAndFlush(user);
    return user;
  }

  async findAll(): Promise<GetUsersDto[]> {
    const users = await this.em.find(User, {}, { exclude: ['password'] });

    return users.map(user => ({
      ...user,
      role: RolesDisplay[user.role],
      createdAt: dayjs(user.createdAt).format('DD-MM-YYYY'),
    }));
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

  async remove(id: number) {
    const user = this.em.getReference(User, id);
    if (!user) return null;
    await this.em.removeAndFlush(user);
    return user;
  }

  async findOneByEmail(email: string) {
    return this.em.findOne(User, { email });
  }
}
