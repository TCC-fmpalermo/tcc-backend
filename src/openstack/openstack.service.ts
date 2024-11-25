import { Injectable } from '@nestjs/common';
import { NetworkService } from './network/network.service';
import { IdentityService } from './/identity/identity.service';
import { ComputeService } from './compute/compute.service';
import { VolumeService } from './volume/volume.service';

interface CreateEnvironmentDto {
    instanceName: string;
    size: number;
    openstackFlavorId: string;
    openstackImageId: string;
}

@Injectable()
export class OpenstackService {
    constructor(
        private readonly identityService: IdentityService,
        private readonly networkService: NetworkService,
        private readonly computeService: ComputeService,
        private readonly volumeService: VolumeService
    ) {}

    async rollbackEnvironment(
        networkId: string, 
        subnetId: string, 
        portId: string, 
        volumeId: string,
        instanceId: string,
        floatingipId: string
    ) {

        if(floatingipId) {
            await this.networkService.deleteFloatingIp(floatingipId);
        }
        if(instanceId) {
            await this.computeService.deleteInstance(instanceId);
        }
        if(volumeId) {
            await this.volumeService.waitForVolumeToBeAvailable(volumeId);
            await this.volumeService.deleteVolume(volumeId);
        }

        if(portId) {
            await this.computeService.deleteNetworkInterface(portId);
        }

        if(subnetId) {
            await this.networkService.removeRouterInterface(subnetId);
        }

        if (networkId) {
            await this.networkService.deleteNetwork(networkId);
        }
    }

    async createEnvironment({ 
        instanceName, 
        size, 
        openstackFlavorId, 
        openstackImageId 
    }: CreateEnvironmentDto) {
        let networkId: string;
        let subnetId: string;
        let portId: string;
        let volumeId: string;
        let instanceId: string;
        let floatingipId: string;

        try {
            await this.identityService.authenticate();

            networkId = await this.networkService.createNetwork();

            subnetId = await this.networkService.createSubnet(networkId);

            await this.networkService.addRouterInterface(subnetId);

            portId = await this.computeService.createNetworkInterface(networkId);

            volumeId = await this.volumeService.createVolume(size, openstackImageId);

            await this.volumeService.waitForVolumeToBeAvailable(volumeId);

            instanceId = await this.computeService.createInstance(instanceName, openstackFlavorId, volumeId, networkId);

            await this.computeService.waitForInstanceToBeReady(instanceId);

            floatingipId = await this.networkService.createFloatingIp(instanceId);

            await this.rollbackEnvironment(networkId, subnetId, portId, volumeId, instanceId, floatingipId);

            return 'Ambiente criado com sucesso!';
        } catch (error) {
            console.error('Erro durante a criação do ambiente:', error?.response?.data);

            console.log('Erro durante a criação do ambiente:', error);

            await this.rollbackEnvironment(networkId, subnetId, portId, volumeId, instanceId, floatingipId);
            
            throw new Error(error);
        }
    }
}
