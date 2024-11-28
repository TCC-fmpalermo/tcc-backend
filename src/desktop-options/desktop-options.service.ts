import { Injectable } from '@nestjs/common';
import { CreateDesktopOptionDto } from './dto/create-desktop-option.dto';
import { UpdateDesktopOptionDto } from './dto/update-desktop-option.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { DesktopOption, DesktopOptionStatus } from './entities/desktop-option.entity';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { OpenstackService } from 'src/openstack/openstack.service';
import { GetDesktopOptionResponseDto } from './dto/get-desktop-option-response.dto';
import { ComputeService } from 'src/openstack/compute/compute.service';
import { ImageService } from 'src/openstack/image/image.service';
import { IdentityService } from 'src/openstack/identity/identity.service';
import { GetDesktopOptionDto } from './dto/get-desktop-option.dto';

@Injectable()
export class DesktopOptionsService {
  constructor(
    @InjectRepository(DesktopOption)
    private readonly desktopOptionRepository: EntityRepository<DesktopOption>,
    private readonly identityService: IdentityService,
    private readonly computeService: ComputeService,
    private readonly imageService: ImageService,
    private readonly em: EntityManager,
  ) {}

  async create(createDesktopOptionDto: CreateDesktopOptionDto) {
    const desktopOption = this.desktopOptionRepository.create(createDesktopOptionDto);
    await this.em.persistAndFlush(desktopOption);
    return desktopOption;
  }

  async findAll({ status }: GetDesktopOptionDto): Promise<GetDesktopOptionResponseDto[]> {
    const whereCondition = status ? { status } : {};

    let desktopOptions = await this.em.find(DesktopOption, whereCondition, { orderBy: { id: 'ASC' } });

    if (!desktopOptions) return [];

    await this.identityService.authenticate();
    const flavors = await this.computeService.getFlavorsDetails();
    const images = await this.imageService.getImages();

    return desktopOptions.map((desktopOption) => {
      return {
        ...desktopOption,
        size: `${desktopOption.size} GB`,
        flavorSpecs: flavors.find((flavor) => flavor.id === desktopOption.openstackFlavorId),
        imageInfo: images.find((image) => image.id === desktopOption.openstackImageId),
      };
    })
  }

  async findAllImages() {
    await this.identityService.authenticate();
    return await this.imageService.getImages();
  }

  async findAllFlavors() {
    await this.identityService.authenticate();
    return await this.computeService.getFlavorsDetails();
  }

  async findAllStatus() {
    return Object.values(DesktopOptionStatus);
  }

  findOne(id: number) {
    return this.em.findOne(DesktopOption, { id: id });
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
