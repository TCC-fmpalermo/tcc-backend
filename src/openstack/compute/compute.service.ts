import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IdentityService } from '../identity/identity.service';
import { randomBytes } from 'crypto';


@Injectable()
export class ComputeService {
    private readonly compute_url = process.env.OPENSTACK_COMPUTE_URL;
    private readonly project_id = process.env.OPENSTACK_IDENTITY_PROJECT_ID;
    private readonly guacamole_instance_id = process.env.OPENSTACK_GUACAMOLE_INSTANCE_ID;
    private readonly charset = process.env.OPENSTACK_PASSWORD_CHARSET;

    constructor(
        private readonly httpService: HttpService, 
        private readonly identityService: IdentityService
    ) {}

    async getFlavorsDetails() {
        await this.identityService.authenticate();
        const token = this.identityService.getToken();
        const response = await firstValueFrom(
            this.httpService.get(
                `${this.compute_url}/v2.1/flavors/detail?project_id=${this.project_id}`,
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
        const guacamoleInstanceId = this.guacamole_instance_id;
        const response = await firstValueFrom(
            this.httpService.post(
                `${this.compute_url}/v2.1/servers/${guacamoleInstanceId}/os-interface`,
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
        const guacamoleInstanceId = this.guacamole_instance_id;
        await firstValueFrom(
            this.httpService.delete(
                `${this.compute_url}/v2.1/servers/${guacamoleInstanceId}/os-interface/${portId}`,
                {
                    headers: {
                        'X-Auth-Token': token,
                    },
                },
            ),
        );
    }

    async createInstance(instanceName: string, password: string, flavorId: string, volumeId: string, networkId: string) {
        const token = this.identityService.getToken();

        const userDataScript = this.generateUserDataScript(password);

        const response = await firstValueFrom(
            this.httpService.post(
                `${this.compute_url}/v2.1/servers`,
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
                        key_name: "guacd",
                        user_data: userDataScript
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
                `${this.compute_url}/v2.1/servers/${instanceId}`,
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
                `${this.compute_url}/v2.1/servers/${instanceId}`,
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
                `${this.compute_url}/v2.1/servers/${instanceId}/os-interface`,
                {
                    headers: {
                        'X-Auth-Token': token,
                    },
                },
            ),
        );
        return response.data.interfaceAttachments[0].port_id;
    }


    generatePassword(length: number): string {
        const bytes = randomBytes(length);
        const password = Array.from(bytes)
          .map(byte => this.charset[byte % this.charset.length])
          .join('');
        return password;
    }

    generateUserDataScript(password: string): string {
        const script = `#!/bin/bash
        echo "ubuntu:${password}" | chpasswd
        `;

        return Buffer.from(script).toString('base64')
    }
}
