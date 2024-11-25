import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IdentityService {
  private token: string;

  constructor(private readonly httpService: HttpService) {}

  // Método para obter o token
  async authenticate(): Promise<void> {
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

    this.token = response.headers['x-subject-token'];
  }

  // Retorna o token
  getToken(): string {
    if (!this.token) {
      throw new Error('Token not found. Please authenticate first.');
    }
    return this.token;
  }
}
