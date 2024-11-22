import { Injectable } from '@nestjs/common';
import { RolesDisplay } from 'src/permissions/role-and-permissions.config';

@Injectable()
export class RolesService {
    getRoles() {
        return Object.entries(RolesDisplay).map(([key, value]) => {
            return { value: key, alias: value };
          });;
    }
}
