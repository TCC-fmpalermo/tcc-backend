import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IdentityService } from '../identity/identity.service';
import { ComputeService } from '../compute/compute.service';

@Injectable()
export class NetworkService {
    constructor(
        private readonly httpService: HttpService, 
        private readonly identityService: IdentityService,
        private readonly computeService: ComputeService
    ) {}

    async createNetwork(): Promise<string> {
        const token = this.identityService.getToken();
        const response = await firstValueFrom(
            this.httpService.post(
                `${process.env.OPENSTACK_NETWORK_URL}/v2.0/networks`,
                {
                    network: {
                        admin_state_up: true,
                    },
                },
                {
                    headers: {
                        'X-Auth-Token': token,
                    },
                },
            ),
        );
        return response.data.network.id;
    }

    async createSubnet(networkId: string): Promise<string> {
        const token = this.identityService.getToken();
        const response = await firstValueFrom(
            this.httpService.post(
                `${process.env.OPENSTACK_NETWORK_URL}/v2.0/subnets`,
                {
                    subnet: {
                        network_id: networkId,
                        subnetpool_id: process.env.OPENSTACK_SUBNET_POOL_ID,
                        ip_version: 4,
                        enable_dhcp: true,
                    },
                },
                {
                    headers: {
                        'X-Auth-Token': token,
                    },
                },
            ),
        );
        
        return response.data.subnet.id;
    }

    async addRouterInterface(subnetId: string): Promise<void> {
        const token = this.identityService.getToken();
        const routerId = process.env.OPENSTACK_ROUTER_ID;
        await firstValueFrom(
            this.httpService.put(
                `${process.env.OPENSTACK_NETWORK_URL}/v2.0/routers/${routerId}/add_router_interface`,
                {
                    subnet_id: subnetId,
                },
                {
                    headers: {
                        'X-Auth-Token': token,
                    },
                },
            ),
        );
    }

    async removeRouterInterface(subnetId: string): Promise<void> {
        const token = this.identityService.getToken();
        const routerId = process.env.OPENSTACK_ROUTER_ID;
        await firstValueFrom(
            this.httpService.put(
                `${process.env.OPENSTACK_NETWORK_URL}/v2.0/routers/${routerId}/remove_router_interface`,
                {
                    subnet_id: subnetId,
                },
                {
                    headers: {
                        'X-Auth-Token': token,
                    },
                },
            ),
        );
    }

    async deleteNetwork(networkId: string): Promise<void> {
        const token = this.identityService.getToken();
        try {
            await firstValueFrom(
                this.httpService.delete(
                    `${process.env.OPENSTACK_NETWORK_URL}/v2.0/networks/${networkId}`,
                    {
                        headers: {
                            'X-Auth-Token': token,
                        },
                    },
                ),
            );
            console.log(`Rede ${networkId} deletada com sucesso.`);
        } catch (error) {
            console.error(`Erro ao deletar rede ${networkId}:`, error);
        }
    }

    async createFloatingIp(instanceId: string): Promise<string> {
        const token = this.identityService.getToken();
        const portId = await this.computeService.getPortIdFromInstance(instanceId);

        const response = await firstValueFrom(
            this.httpService.post(
                `${process.env.OPENSTACK_NETWORK_URL}/v2.0/floatingips`,
                {
                    floatingip: {
                        floating_network_id: process.env.OPENSTACK_PUBLIC_NETWORK_ID,
                        port_id: portId
                    },
                },
                {
                    headers: {
                        'X-Auth-Token': token,
                    },
                },
            ),
        );
        return response.data.floatingip.id;
    }

    async deleteFloatingIp(floatingIpId: string): Promise<void> {
        const token = this.identityService.getToken();
        await firstValueFrom(
            this.httpService.delete(
                `${process.env.OPENSTACK_NETWORK_URL}/v2.0/floatingips/${floatingIpId}`,
                {
                    headers: {
                        'X-Auth-Token': token,
                    },
                },
            ),
        );
    }
}
