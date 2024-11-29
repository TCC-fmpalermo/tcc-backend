import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { IdentityService } from '../identity/identity.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class VolumeService {
    constructor(
        private readonly httpService: HttpService,
        private readonly identityService: IdentityService
    ) {}

    async createVolume(size: number, openstackImageId: string): Promise<string> {
        const token = this.identityService.getToken();
        const projectId = process.env.OPENSTACK_IDENTITY_PROJECT_ID;
        const response = await firstValueFrom(
            this.httpService.post(
                `${process.env.OPENSTACK_VOLUME_URL}/v3/${projectId}/volumes`,
                {
                    volume: {
                        size: size,
                        imageRef: openstackImageId,
                    },
                },
                {
                    headers: {
                        'X-Auth-Token': token,
                    },
                },
            ),
        );
        return response.data.volume.id;
    }

    async deleteVolume(volumeId: string): Promise<void> {
        const token = this.identityService.getToken();
        const projectId = process.env.OPENSTACK_IDENTITY_PROJECT_ID;
        await firstValueFrom(
            this.httpService.delete(
                `${process.env.OPENSTACK_VOLUME_URL}/v3/${projectId}/volumes/${volumeId}`,
                {
                    headers: {
                        'X-Auth-Token': token,
                    },
                },
            ),
        );
    }

    async findOneVolume(volumeId: string): Promise<any> {
        const token = this.identityService.getToken();

        const response = await firstValueFrom(
            this.httpService.get(
                `${process.env.OPENSTACK_VOLUME_URL}/v3/${process.env.OPENSTACK_IDENTITY_PROJECT_ID}/volumes/${volumeId}`,
                {
                    headers: {
                        'X-Auth-Token': token,
                    },
                },
        ));

        return {
            id: response.data.volume.id,
            status: response.data.volume.status,
            size: response.data.volume.size
        };
    }

    async waitForVolumeToBeAvailable(volumeId: string, maxRetries = 20, delay = 5000): Promise<void> {
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            const volume = await this.findOneVolume(volumeId);

            if (volume.status === 'available') {
                return;
            }

            if(volume.status === 'error') {
                throw new Error('Erro ao criar volume');
            }

            await new Promise((resolve) => setTimeout(resolve, delay));
        }

        throw new Error('Tempo limite atingido');
    }
}
