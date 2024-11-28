import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { IdentityService } from '../identity/identity.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ImageService {
    constructor(
        private readonly httpService: HttpService,
        private readonly identityService: IdentityService
    ) {}

    async getImages() {
        const token = this.identityService.getToken();
        const response = await firstValueFrom(
            this.httpService.get(
                `${process.env.OPENSTACK_IMAGE_URL}/v2/images?status=active`,
                {
                    headers: {
                        'X-Auth-Token': token,
                    },
                },
            ),
        );

        if(response.data.images.length === 0) {
            throw new NotFoundException('Nenhuma imagem encontrada');
        }

        return response.data.images.map((image) => {
            const sizeInGB = image.size / 1024 / 1024 / 1024;
            const sizeInMB = image.size / 1024 / 1024;

            const size =
                sizeInGB >= 1
                    ? `${sizeInGB.toFixed(2)} GB`
                    : `${sizeInMB.toFixed(2)} MB`;

            return {
                id: image.id,
                name: image.name,
                size,
            };
        });
    }
}
