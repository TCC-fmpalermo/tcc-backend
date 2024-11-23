import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OpenstackService {
    constructor(private readonly httpService: HttpService) {}

    private async getToken(): Promise<string> {
        const response = await firstValueFrom(
            this.httpService.post(
                `${process.env.OPENSTACK_IDENTITY_URL}/v3/auth/tokens`,
                {
                    auth: {
                        identity: {
                            methods: ['password'],
                            password: {
                                user: {
                                    name: process.env.OPENSTACK_IDENTITY_USERNAME,
                                    domain: {
                                        id: 'default',
                                    },
                                    password: process.env.OPENSTACK_IDENTITY_PASSWORD,
                                },
                            },
                        },
                        scope: {
                            project: {
                                name: process.env.OPENSTACK_IDENTITY_PROJECT_NAME,
                                domain: {
                                    id: 'default',
                                },
                            },
                        },
                    },
                },
            ),
        );

        const token = response.headers['x-subject-token'];
        return token;
    }

    async getFlavorsDetails() {
        const token = await this.getToken();
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
            }
        });
    }
}
