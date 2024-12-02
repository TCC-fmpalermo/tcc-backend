import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCloudResourceDto } from './dto/create-cloud-resource.dto';
import { UpdateCloudResourceDto } from './dto/update-cloud-resource.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CloudResource, CloudResourceStatus } from './entities/cloud-resource.entity';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { OpenstackService } from 'src/openstack/openstack.service';
import { DesktopOptionsService } from 'src/desktop-options/desktop-options.service';
import { User } from 'src/users/entities/user.entity';
import { InstancesService } from 'src/instances/instances.service';
import { VolumesService } from 'src/volumes/volumes.service';
import { ComputeService } from 'src/openstack/compute/compute.service';
import { ImageService } from 'src/openstack/image/image.service';
import { IdentityService } from 'src/openstack/identity/identity.service';
import * as dayjs from "dayjs";
import { chooseMBorGB } from 'src/utils/formatBytes';
import { GuacamoleService } from 'src/instances/guacamole/guacamole.service';
import { UpdateCloudResourceStatusDto } from './dto/update-cloud-resource-status.dto';

@Injectable()
export class CloudResourcesService {
  constructor(
    @InjectRepository(CloudResource)
    private readonly cloudResourceRepository: EntityRepository<CloudResource>,
    private readonly desktopOptionsService: DesktopOptionsService,
    private readonly openstackService: OpenstackService,
    private readonly identityService: IdentityService,
    private readonly computeService: ComputeService,
    private readonly imageService: ImageService,
    private readonly instancesService: InstancesService,
    private readonly volumesService: VolumesService,
    private readonly guacamoleService: GuacamoleService,
    private readonly em: EntityManager
  ) {}

  async create({ desktopOptionId, alias }: CreateCloudResourceDto, user: User) {
    const { 
      size, 
      openstackFlavorId, 
      openstackImageId,
      defaultUsername
    } = await this.desktopOptionsService.findOne(desktopOptionId);

    const flavor = await this.computeService.getFlavorDetails(openstackFlavorId);
    const instanceName = 'instance-' + Date.now();
    const password = this.computeService.generatePassword(12);

    const newEnvironment = await this.openstackService.createEnvironment({
      userId: user.id,
      instanceName,
      password,
      size,
      openstackFlavorId,
      openstackImageId,
    });

    const instance = await this.instancesService.create({
      name: instanceName,
      ipAddress: newEnvironment.ipAddress,
      username: defaultUsername,
      password: password,
      cpus: flavor.vcpus,
      ram: flavor.ram,
      openstackInstanceId: newEnvironment.instanceId,
      openstackNetworkId: newEnvironment.networkId,
      openstackFlavorId: openstackFlavorId
    });

    const volume = await this.volumesService.create({
      size: size,
      openstackVolumeId: newEnvironment.volumeId,
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

  async findAll() {
    const cloudResources = await this.cloudResourceRepository.find({}, { populate: ['user', 'instance', 'volume'], orderBy: { id: 'ASC' } });

    await this.identityService.authenticate();
    const images = await this.imageService.getImages();
    const flavors = await this.computeService.getFlavorsDetails();

    return cloudResources.map(({ instance, volume, ...cloudResource }) => {
      return {
        id: cloudResource.id,
        alias: cloudResource.alias,
        createdAt: dayjs(cloudResource.createdAt).format('DD-MM-YYYY HH:mm:ss'),
        updatedAt: dayjs(cloudResource.updatedAt).format('DD-MM-YYYY HH:mm:ss'),
        lastAccessedAt: cloudResource.lastAccessedAt ? dayjs(cloudResource.lastAccessedAt).format('DD-MM-YYYY HH:mm:ss'): "Sem acesso registrado",
        instance: {
          id: instance.id,
          name: instance.name,
          ipAddress: instance.ipAddress,
          flavorSpecs: flavors.find((flavor) => flavor.id === instance.openstackFlavorId),
          cpus: `${instance.cpus} cores`,
          ram: chooseMBorGB(instance.ram, 'MB', 0),
        },
        volume: {
          id: volume.id,
          size: `${volume.size} GB`,
          imageInfo: images.find((image) => image.id === volume.openstackImageId),
        },
        user: {
          id: cloudResource.user.id,
          firstName: cloudResource.user.firstName,
          lastName: cloudResource.user.lastName,
        },
        status: cloudResource.status
      };
    });
  }

  async findUserCloudResources(user: number): Promise<any> {
    const cloudResources = await this.cloudResourceRepository.find({ user: user }, { populate: ['instance', 'volume'], orderBy: { id: 'ASC' } });

    await this.identityService.authenticate();
    const images = await this.imageService.getImages();

    return cloudResources.map(({ instance, volume, ...cloudResource }) => {
      return {
        id: cloudResource.id,
        alias: cloudResource.alias,
        createdAt: dayjs(cloudResource.createdAt).format('DD-MM-YYYY HH:mm:ss'),
        updatedAt: dayjs(cloudResource.updatedAt).format('DD-MM-YYYY HH:mm:ss'),
        lastAccessedAt: cloudResource.lastAccessedAt ? dayjs(cloudResource.lastAccessedAt).format('DD-MM-YYYY HH:mm:ss'): "Sem acesso registrado",
        instance: {
          id: instance.id,
          cpus: `${instance.cpus} cores`,
          ram: chooseMBorGB(instance.ram, 'MB', 0),
        },
        volume: {
          id: volume.id,
          size: `${volume.size} GB`,
          imageInfo: images.find((image) => image.id === volume.openstackImageId),
        },
        status: cloudResource.status
      };
    });
  }

  async getGuacamoleToken(id: number, user: User) {
    const cloudResource = await this.findOne(id);

    if(!cloudResource) {
      throw new NotFoundException('Instância não encontrada');
    }

    if(cloudResource.user.id !== user.id || cloudResource.status !== CloudResourceStatus.Ativo) {
      throw new ForbiddenException('Acesso negado');
    }

    const guacamoleToken = this.guacamoleService.generateGuacamoleToken(cloudResource.instance);
    
    return {
      token: guacamoleToken
    };
  }

  findOne(id: number) {
    return this.em.findOne(CloudResource, id, { populate: ['instance', 'volume', 'desktopOption'] });
  }

  async update(id: number, updateCloudResourceDto: UpdateCloudResourceDto) {
    const cloudResource = await this.findOne(id);
    if (!cloudResource) throw new NotFoundException('Instância não encontrada');
    wrap(cloudResource).assign(updateCloudResourceDto);
    await this.em.flush();
    return cloudResource;
  }

  async updateStatus(id: number, { status }: UpdateCloudResourceStatusDto) {
    const cloudResource = await this.findOne(id);

    if (!cloudResource) throw new NotFoundException('Instância não encontrada');

    wrap(cloudResource).assign({ status: status });
    await this.em.flush();
    return cloudResource;
  }

  async remove(id: number) {
    const cloudResource = await this.findOne(id);
    
    if (!cloudResource) throw new NotFoundException('Desktop não encontrado');

    await this.openstackService.deleteEnvironment({
      instanceId: cloudResource.instance.openstackInstanceId,
      ipAddress: cloudResource.instance.ipAddress,
      networkId: cloudResource.instance.openstackNetworkId,
      volumeId: cloudResource.volume.openstackVolumeId
    });

    await this.em.removeAndFlush(cloudResource);

    await this.instancesService.remove(cloudResource.instance.id);
    await this.volumesService.remove(cloudResource.volume.id);

    return cloudResource;
  }
}
