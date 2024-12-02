import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDesktopRequestDto } from './dto/create-desktop-request.dto';
import { UpdateDesktopRequestDto } from './dto/update-desktop-request-status.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { DesktopRequest } from './entities/desktop-request.entity';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from 'src/users/entities/user.entity';
import { DesktopOption, DesktopOptionStatus } from 'src/desktop-options/entities/desktop-option.entity';
import { GetDesktopRequestDto } from './dto/get-desktop-request.dto';
import * as dayjs from "dayjs";
import { DesktopOptionsService } from 'src/desktop-options/desktop-options.service';

@Injectable()
export class DesktopRequestsService {
  constructor(
    @InjectRepository(DesktopRequest)
    private readonly desktopRequestRepository: EntityRepository<DesktopRequest>,
    private readonly desktopOptionsService: DesktopOptionsService,
    private readonly em: EntityManager
  ) {}

  async create(createDesktopRequestDto: CreateDesktopRequestDto, user: User) {
    const desktopRequest = this.desktopRequestRepository.create({
      ...createDesktopRequestDto,
      desktopOption: this.em.getReference(DesktopOption, createDesktopRequestDto.desktopOptionId),
      user: this.em.getReference(User, user.id),
    });
    await this.em.persistAndFlush(desktopRequest);
    return desktopRequest;
  }

  async findAll({ status }: GetDesktopRequestDto):Promise<any> {
    const whereCondition = status ? { status } : {};
    const desktopRequests = await this.em.find(DesktopRequest, whereCondition, { populate: ['user'], orderBy: { id: 'ASC' } });

    const desktopOptions = await this.desktopOptionsService.findAll({ status: DesktopOptionStatus.Ativo });
    
    return desktopRequests.map((desktopRequest) => {
      return {
        ...desktopRequest,
        user: {
          id: desktopRequest.user.id,
          firstName: desktopRequest.user.firstName,
          lastName: desktopRequest.user.lastName,
        },
        desktopOption: desktopOptions.find((desktopOption) => desktopOption.id === desktopRequest.desktopOption.id),
        requestedAt: dayjs(desktopRequest.requestedAt).format('DD-MM-YYYY HH:mm:ss'),
        finishedAt: desktopRequest.finishedAt ? dayjs(desktopRequest.finishedAt).format('DD-MM-YYYY HH:mm:ss') : 'Sem data de conclusão',
      };
    });
  }
  
  async findUserDesktopRequests(userId: number): Promise<any> {
    if(!userId) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const whereCondition = {
      user: { id: userId }
    };
    console.log(whereCondition);
    
    const desktopRequests = await this.em.find(DesktopRequest, whereCondition, { populate: ['user'], orderBy: { id: 'ASC' } });
    console.log(desktopRequests);
    
    const desktopOptions = await this.desktopOptionsService.findAll({ status: DesktopOptionStatus.Ativo });
    
    return desktopRequests.map((desktopRequest) => {
      return {
        ...desktopRequest,
        user: {
          id: desktopRequest.user.id,
          firstName: desktopRequest.user.firstName,
          lastName: desktopRequest.user.lastName,
        },
        desktopOption: desktopOptions.find((desktopOption) => desktopOption.id === desktopRequest.desktopOption.id),
        requestedAt: dayjs(desktopRequest.requestedAt).format('DD-MM-YYYY HH:mm:ss'),
        finishedAt: desktopRequest.finishedAt ? dayjs(desktopRequest.finishedAt).format('DD-MM-YYYY HH:mm:ss') : 'Sem data de conclusão',
      };
    });
  }

  findOne(id: number) {
    return this.em.findOne(DesktopRequest, id);
  }

  async updateStatus(id: number, { status }: UpdateDesktopRequestDto) {
    const desktopRequest = await this.findOne(id);
    if (!desktopRequest) throw new NotFoundException('Solicitação de desktop não encontrada');

    wrap(desktopRequest).assign({ status: status });
    await this.em.flush();
    return desktopRequest;
  }

  async remove(id: number, userId: number) {
    const desktopRequest = await this.findOne(id);
    if (!desktopRequest) throw new NotFoundException('Solicitação de desktop não encontrada');

    if(desktopRequest.user.id !== userId) {
      throw new ForbiddenException('Você não pode excluir essa solicitação');
    }

    await this.em.removeAndFlush(desktopRequest);
    return desktopRequest;
  }
}
