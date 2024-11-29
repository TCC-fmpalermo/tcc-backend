import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { NetworkService } from './network/network.service';
import { IdentityService } from './/identity/identity.service';
import { ComputeService } from './compute/compute.service';
import { VolumeService } from './volume/volume.service';
import { createFloatingIpResponseDto } from './network/network.dto';
import { DeleteEnvironmentDto } from './dto/delete-environment.dto';
import { ProgressService } from 'src/progress/progress.service';
@Injectable()
export class OpenstackService {

    private readonly guacamole_instance_id = process.env.OPENSTACK_GUACAMOLE_INSTANCE_ID;
    constructor(
        private readonly identityService: IdentityService,
        private readonly networkService: NetworkService,
        private readonly computeService: ComputeService,
        private readonly volumeService: VolumeService,
        private readonly progressService: ProgressService
    ) {}


    async createEnvironment({ 
        userId,
        instanceName, 
        password,
        size, 
        openstackFlavorId, 
        openstackImageId 
    }: CreateEnvironmentDto) {
        let networkId: string;
        let subnetId: string;
        let portId: string;
        let volumeId: string;
        let instanceId: string;
        let floatingip: createFloatingIpResponseDto;

        try {
            this.progressService.sendProgress(userId, 0, 'Iniciando criação do ambiente...');
            await this.identityService.authenticate();

            this.progressService.sendProgress(userId, 10, 'Criando rede privada...');
            networkId = await this.networkService.createNetwork();

            this.progressService.sendProgress(userId, 20, 'Criando sub-rede...');
            subnetId = await this.networkService.createSubnet(networkId);

            this.progressService.sendProgress(userId, 30, 'Adicionando interface de roteamento...');
            await this.networkService.addRouterInterface(subnetId);

            portId = await this.computeService.createNetworkInterface(networkId);

            this.progressService.sendProgress(userId, 40, 'Criando volume...');
            volumeId = await this.volumeService.createVolume(size, openstackImageId);

            this.progressService.sendProgress(userId, 50, 'Aguardando volume estar disponível...');
            await this.volumeService.waitForVolumeToBeAvailable(volumeId);

            this.progressService.sendProgress(userId, 80, 'Criando instância...');
            instanceId = await this.computeService.createInstance(instanceName, password, openstackFlavorId, volumeId, networkId);

            this.progressService.sendProgress(userId, 90, 'Aguardando instância estar pronta...');
            await this.computeService.waitForInstanceToBeReady(instanceId);

            floatingip = await this.networkService.createFloatingIp({instanceId});

            this.progressService.sendProgress(userId, 100, 'Ambiente criado com sucesso!');

            return {
                instanceId,
                networkId,
                ipAddress: floatingip.ipAddress,
                volumeId
            };
        } catch (error) {
            this.progressService.sendProgress(userId, 0, 'Erro durante a criação do ambiente...');
            console.error('Erro durante a criação do ambiente:', error?.response?.data);

            console.log('Erro durante a criação do ambiente:', error);

            await this.rollbackEnvironment(userId, networkId, subnetId, portId, volumeId, instanceId, floatingip?.id);
            
            throw new InternalServerErrorException(error);
        }
    }

    async rollbackEnvironment(
        userId: number,
        networkId: string, 
        subnetId: string, 
        portId: string, 
        volumeId: string,
        instanceId: string,
        floatingipId: string
    ) {

        this.progressService.sendProgress(userId, 10, 'Deletando ambiente...');
        if(floatingipId) {
            this.progressService.sendProgress(userId, 20, 'Deletando IP flutuante...');
            await this.networkService.deleteFloatingIp(floatingipId);
        }
        if(instanceId) {
            this.progressService.sendProgress(userId, 30, 'Deletando instância...');
            await this.computeService.deleteInstance(instanceId);
        }
        if(volumeId) {
            this.progressService.sendProgress(userId, 50, 'Deletando volume...');
            await this.volumeService.waitForDeleteVolume(volumeId);
            await this.volumeService.deleteVolume(volumeId);
        }

        if(portId) {
            this.progressService.sendProgress(userId, 80, 'Deletando interface de roteamento...');
            await this.computeService.deleteNetworkInterface(portId);
        }

        if(subnetId) {

            await this.networkService.removeRouterInterface(subnetId);
        }

        if (networkId) {
            this.progressService.sendProgress(userId, 100, 'Deletando rede...');
            await this.networkService.deleteNetwork(networkId);
        }
    }

    async deleteEnvironment({ instanceId, ipAddress, networkId, volumeId }: DeleteEnvironmentDto) {
        await this.identityService.authenticate();

        const floatingipId = await this.networkService.getFloatingIpIdByIpAddress(ipAddress);

        await this.networkService.deleteFloatingIp(floatingipId);
        
        await this.computeService.deleteInstance(instanceId);

        await this.volumeService.waitForVolumeToBeAvailable(volumeId);
        await this.volumeService.deleteVolume(volumeId);

        const guacamolePortInterfaces = await this.computeService.getPortInterfacesFromInstance(this.guacamole_instance_id);

        const guacamolePortId = guacamolePortInterfaces.find((portInterface) => portInterface.net_id === networkId).port_id;
        
        await this.computeService.deleteNetworkInterface(guacamolePortId);

        const subnets = await this.networkService.getSubnets(networkId);

        await this.networkService.removeRouterInterface(subnets[0].id);

        await this.networkService.deleteNetwork(networkId);
    }
}
