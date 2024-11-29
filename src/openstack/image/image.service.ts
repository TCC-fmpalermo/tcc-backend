import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { IdentityService } from '../identity/identity.service';
import { firstValueFrom } from 'rxjs';
import { chooseMBorGB } from 'src/utils/formatBytes';

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
            const size = chooseMBorGB(image.size, 'B');

            return {
                id: image.id,
                name: image.name,
                size,
            };
        });
    }
}
