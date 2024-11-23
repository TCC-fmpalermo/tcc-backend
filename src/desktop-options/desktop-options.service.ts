import { Injectable } from '@nestjs/common';
import { CreateDesktopOptionDto } from './dto/create-desktop-option.dto';
import { UpdateDesktopOptionDto } from './dto/update-desktop-option.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { DesktopOption, DesktopOptionStatus } from './entities/desktop-option.entity';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { OpenstackService } from 'src/openstack/openstack.service';
import { GetDesktopOptionResponseDto } from './dto/get-desktop-option-response.dto';

@Injectable()
export class DesktopOptionsService {
  constructor(
    @InjectRepository(DesktopOption)
    private readonly desktopOptionRepository: EntityRepository<DesktopOption>,
    private readonly openstackService: OpenstackService,
    private readonly em: EntityManager,
  ) {}

  async create(createDesktopOptionDto: CreateDesktopOptionDto) {
    const desktopOption = this.desktopOptionRepository.create(createDesktopOptionDto);
    await this.em.persistAndFlush(desktopOption);
    return desktopOption;
  }

  async findAll(): Promise<GetDesktopOptionResponseDto[]> {
    let desktopOptions = await this.em.find(DesktopOption, { status: DesktopOptionStatus.Ativo }, { orderBy: { id: 'ASC' } });

    if (!desktopOptions) return [];

    const flavors = await this.openstackService.getFlavorsDetails();

    return desktopOptions.map((desktopOption) => {
      return {
        ...desktopOption,
        size: `${desktopOption.size} GB`,
        flavorSpecs: flavors.find((flavor) => flavor.id === desktopOption.openstackFlavorId),
      };
    })
  }

  findOne(id: number) {
    return this.em.findOne(DesktopOption, id);
  }

  async update(id: number, updateDesktopOptionDto: UpdateDesktopOptionDto) {
    const desktopOption = await this.findOne(id);
    if (!desktopOption) return null;
    wrap(desktopOption).assign(updateDesktopOptionDto);
    await this.em.flush();
    return desktopOption;
  }

  async remove(id: number) {
    const desktopOption = this.em.getReference(DesktopOption, id);
    if (!desktopOption) return null;
    await this.em.removeAndFlush(desktopOption);
    return desktopOption;
  }
}
