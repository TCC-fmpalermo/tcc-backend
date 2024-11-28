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
import { InstancesService } from 'src/instances/instances.service';
import { VolumesService } from 'src/volumes/volumes.service';
import { ComputeService } from 'src/openstack/compute/compute.service';

@Injectable()
export class CloudResourcesService {
  constructor(
    @InjectRepository(CloudResource)
    private readonly cloudResourceRepository: EntityRepository<CloudResource>,
    private readonly desktopOptionsService: DesktopOptionsService,
    private readonly openstackService: OpenstackService,
    private readonly computeService: ComputeService,
    private readonly instancesService: InstancesService,
    private readonly volumesService: VolumesService,
    private readonly em: EntityManager
  ) {}

  async create({ desktopOptionId, alias }: CreateCloudResourceDto, user: User) {
    const { 
      size, 
      openstackFlavorId, 
      openstackImageId, 
      operatingSystem 
    } = await this.desktopOptionsService.findOne(desktopOptionId);

    const instanceName = 'instance-' + Date.now();
    const password = this.computeService.generatePassword(12);

    const newEnvironment = await this.openstackService.createEnvironment({
      instanceName,
      password,
      size,
      openstackFlavorId,
      openstackImageId,
    });

    const instance = await this.instancesService.create({
      name: instanceName,
      openstackInstanceId: newEnvironment.instanceId,
      username: "ubuntu",
      password: password,
      ipAddress: newEnvironment.ipAddress,
    });

    const volume = await this.volumesService.create({
      operatingSystem: operatingSystem,
      openstackVolumeId: newEnvironment.volumeId,
      size: size,
      openstackImageId: openstackImageId,
    });

    const cloudResource = this.cloudResourceRepository.create({
      alias,
      user: this.em.getReference(User, user.id),
      instance: instance,
      volume: volume,
      desktopOption: desktopOptionId,
    });

    await this.em.persistAndFlush(cloudResource);

    return cloudResource;
  }

  findAll() {
    return this.cloudResourceRepository.findAll({ populate: ['instance', 'volume', 'desktopOption'] });
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
