import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDesktopDto } from './dto/create-desktop.dto';
import { UpdateDesktopAliasDto } from './dto/update-desktop-alias.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Desktop, DesktopStatus } from './entities/desktop.entity';
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
import { UpdateDesktopStatusDto } from './dto/update-desktop-status.dto';

@Injectable()
export class DesktopsService {
  constructor(
    @InjectRepository(Desktop)
    private readonly desktopRepository: EntityRepository<Desktop>,
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

  async create({ desktopOptionId, alias }: CreateDesktopDto, user: User) {
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

    const desktop = this.desktopRepository.create({
      alias,
      user: this.em.getReference(User, user.id),
      instance: instance,
      volume: volume,
      desktopOption: desktopOptionId,
    });

    await this.em.persistAndFlush(desktop);

    return desktop;
  }

  async findAll() {
    const desktops = await this.desktopRepository.find({}, { populate: ['user', 'instance', 'volume'], orderBy: { id: 'ASC' } });

    await this.identityService.authenticate();
    const images = await this.imageService.getImages();
    const flavors = await this.computeService.getFlavorsDetails();

    return desktops.map(({ instance, volume, ...desktop }) => {
      return {
        id: desktop.id,
        alias: desktop.alias,
        createdAt: dayjs(desktop.createdAt).format('DD-MM-YYYY HH:mm:ss'),
        updatedAt: dayjs(desktop.updatedAt).format('DD-MM-YYYY HH:mm:ss'),
        lastAccessedAt: desktop.lastAccessedAt ? dayjs(desktop.lastAccessedAt).format('DD-MM-YYYY HH:mm:ss'): "Sem acesso registrado",
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
          id: desktop.user.id,
          firstName: desktop.user.firstName,
          lastName: desktop.user.lastName,
        },
        status: desktop.status
      };
    });
  }

  async findUserDesktops(user: number): Promise<any> {
    const desktops = await this.desktopRepository.find({ user: user }, { populate: ['instance', 'volume'], orderBy: { id: 'ASC' } });

    await this.identityService.authenticate();
    const images = await this.imageService.getImages();

    return desktops.map(({ instance, volume, ...desktop }) => {
      return {
        id: desktop.id,
        alias: desktop.alias,
        createdAt: dayjs(desktop.createdAt).format('DD-MM-YYYY HH:mm:ss'),
        updatedAt: dayjs(desktop.updatedAt).format('DD-MM-YYYY HH:mm:ss'),
        lastAccessedAt: desktop.lastAccessedAt ? dayjs(desktop.lastAccessedAt).format('DD-MM-YYYY HH:mm:ss'): "Sem acesso registrado",
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
        status: desktop.status
      };
    });
  }

  async getGuacamoleToken(id: number, user: User) {
    const desktop = await this.findOne(id);

    if(!desktop) {
      throw new NotFoundException('Desktop não encontrado');
    }

    if(desktop.user.id !== user.id || desktop.status !== DesktopStatus.Ativo) {
      throw new ForbiddenException('Acesso negado');
    }

    const guacamoleToken = this.guacamoleService.generateGuacamoleToken(desktop.instance);
    
    return {
      token: guacamoleToken
    };
  }

  findOne(id: number) {
    return this.em.findOne(Desktop, id, { populate: ['instance', 'volume', 'desktopOption'] });
  }

  async updateAlias(id: number, updateDesktopDto: UpdateDesktopAliasDto, userId: number) {
    const desktop = await this.findOne(id);

    if (!desktop) throw new NotFoundException('Desktop não encontrado');

    if(desktop.user.id !== userId) {
      throw new ForbiddenException('Acesso negado');
    }

    wrap(desktop).assign({ alias: updateDesktopDto.alias });

    await this.em.flush();
    
    return desktop;
  }

  async updateStatus(id: number, { status }: UpdateDesktopStatusDto) {
    const desktop = await this.findOne(id);

    if (!desktop) throw new NotFoundException('Desktop não encontrado');

    wrap(desktop).assign({ status: status });
    await this.em.flush();
    return desktop;
  }

  async remove(id: number, userId: number) {
    const desktop = await this.findOne(id);
    
    if (!desktop) throw new NotFoundException('Desktop não encontrado');

    if(desktop.user.id !== userId) {
      throw new ForbiddenException('Acesso negado');
    }

    await this.openstackService.deleteEnvironment({
      instanceId: desktop.instance.openstackInstanceId,
      ipAddress: desktop.instance.ipAddress,
      networkId: desktop.instance.openstackNetworkId,
      volumeId: desktop.volume.openstackVolumeId
    });

    await this.em.removeAndFlush(desktop);

    await this.instancesService.remove(desktop.instance.id);
    await this.volumesService.remove(desktop.volume.id);

    return desktop;
  }
}
