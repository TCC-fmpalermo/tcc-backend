import { Injectable } from '@nestjs/common';
import { CreateCloudResourceDto } from './dto/create-cloud-resource.dto';
import { UpdateCloudResourceDto } from './dto/update-cloud-resource.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CloudResource } from './entities/cloud-resource.entity';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { OpenstackService } from 'src/openstack/openstack.service';
import { DesktopOptionsService } from 'src/desktop-options/desktop-options.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CloudResourcesService {
  constructor(
    @InjectRepository(CloudResource)
    private readonly cloudResourceRepository: EntityRepository<CloudResource>,
    private readonly desktopOptionsService: DesktopOptionsService,
    private readonly openstackService: OpenstackService,
    private readonly em: EntityManager
  ) {}

  async create({ instanceName, desktopOptionId }: CreateCloudResourceDto, user: User) {
    const { size, openstackFlavorId, openstackImageId } = await this.desktopOptionsService.findOne(desktopOptionId);
    
    const response = await this.openstackService.createEnvironment({
      instanceName,
      size,
      openstackFlavorId,
      openstackImageId,
    });
    // const cloudResource = this.cloudResourceRepository.create(createCloudResourceDto);
    // await this.em.persistAndFlush(cloudResource);
    // return cloudResource;
  }

  findAll() {
    return this.cloudResourceRepository.findAll();
  }

  findOne(id: number) {
    return this.em.findOne(CloudResource, id);
  }

  async update(id: number, updateCloudResourceDto: UpdateCloudResourceDto) {
    const cloudResource = await this.findOne(id);
    if (!cloudResource) return null;
    wrap(cloudResource).assign(updateCloudResourceDto);
    await this.em.flush();
    return cloudResource;
  }

  async remove(id: number) {
    const cloudResource = this.em.getReference(CloudResource, id);
    if (!cloudResource) return null;
    await this.em.removeAndFlush(cloudResource);
    return cloudResource;
  }
}
