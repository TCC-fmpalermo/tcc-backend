import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IdentityService } from '../identity/identity.service';

@Injectable()
export class ComputeService {
    constructor(
        private readonly httpService: HttpService, 
        private readonly identityService: IdentityService
    ) {}

    async getFlavorsDetails() {
        await this.identityService.authenticate();
        const token = this.identityService.getToken();
        const response = await firstValueFrom(
            this.httpService.get(
                `${process.env.OPENSTACK_COMPUTE_URL}/v2.1/flavors/detail?project_id=${process.env.OPENSTACK_IDENTITY_PROJECT_ID}`,
                {
                    headers: {
                        'X-Auth-Token': token,
                    },
                },
            ),
        );
        return response.data.flavors.map((flavor) => {
            return {
                id: flavor.id,
                name: flavor.name,
                ram: `${flavor.ram / 1024} GB`,
                vcpus: `${flavor.vcpus} cores`,
            };
        });
    }

    async createNetworkInterface(networkId: string) {
        const token = this.identityService.getToken();
        const guacamoleInstanceId = process.env.OPENSTACK_GUACAMOLE_INSTANCE_ID;
        const response = await firstValueFrom(
            this.httpService.post(
                `${process.env.OPENSTACK_COMPUTE_URL}/v2.1/servers/${guacamoleInstanceId}/os-interface`,
                {
                    interfaceAttachment: {
                        net_id: networkId,
                    },
                },
                {
                    headers: {
                        'X-Auth-Token': token,
                    },
                },
            ),
        );
        return response.data.interfaceAttachment.port_id;
    }

    async deleteNetworkInterface(portId: string) {
        const token = this.identityService.getToken();
        const guacamoleInstanceId = process.env.OPENSTACK_GUACAMOLE_INSTANCE_ID;
        await firstValueFrom(
            this.httpService.delete(
                `${process.env.OPENSTACK_COMPUTE_URL}/v2.1/servers/${guacamoleInstanceId}/os-interface/${portId}`,
                {
                    headers: {
                        'X-Auth-Token': token,
                    },
                },
            ),
        );
    }

    async createInstance(instanceName: string, flavorId: string, volumeId: string, networkId: string) {
        const token = this.identityService.getToken();
        const response = await firstValueFrom(
            this.httpService.post(
                `${process.env.OPENSTACK_COMPUTE_URL}/v2.1/servers`,
                {
                    server: {
                        name: instanceName,
                        flavorRef: flavorId,
                        security_groups: [
                            {
                                name:'default'
                            },
                            {
                                name:'remote-connection'
                            },
                        ],
                        block_device_mapping_v2: [
                            {
                                boot_index: "0",
                                uuid: volumeId,
                                delete_on_termination: false,
                                destination_type: "volume",
                                source_type: "volume"
                            }
                        ],
                        networks: [
                            {
                                uuid: networkId,
                            }
                        ],
                        key_name: "guacd"
                    },
                },
                {
                    headers: {
                        'X-Auth-Token': token,
                    },
                },
            ),
        );
        return response.data.server.id;
    }

    async findOneInstance(instanceId: string) {
        const token = this.identityService.getToken();
        const response = await firstValueFrom(
            this.httpService.get(
                `${process.env.OPENSTACK_COMPUTE_URL}/v2.1/servers/${instanceId}`,
                {
                    headers: {
                        'X-Auth-Token': token,
                    },
                },
            ),
        );
        return response.data.server;
    }

    async waitForInstanceToBeReady(instanceId: string, maxRetries = 10, delay = 5000) {
        console.log(`Aguardando instância ${instanceId} ser criada...`);
        
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            const instance = await this.findOneInstance(instanceId);
    
            if (instance.status === 'ACTIVE') {
                return;
            }

            if(instance.status === 'ERROR') {
                throw new Error('Erro ao criar instância');
            }
    
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    
        throw new Error('Tempo limite atingido');

    }

    async deleteInstance(instanceId: string) {
        const token = this.identityService.getToken();
        await firstValueFrom(
            this.httpService.delete(
                `${process.env.OPENSTACK_COMPUTE_URL}/v2.1/servers/${instanceId}`,
                {
                    headers: {
                        'X-Auth-Token': token,
                    },
                },
            ),
        );

    }

    async getPortIdFromInstance(instanceId: string) {
        const token = this.identityService.getToken();
        const response = await firstValueFrom(
            this.httpService.get(
                `${process.env.OPENSTACK_COMPUTE_URL}/v2.1/servers/${instanceId}/os-interface`,
                {
                    headers: {
                        'X-Auth-Token': token,
                    },
                },
            ),
        );
        return response.data.interfaceAttachments[0].port_id;
    }
}
