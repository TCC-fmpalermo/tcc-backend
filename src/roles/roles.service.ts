import { Injectable } from '@nestjs/common';
import { RolesDisplay } from 'src/permissions/role-and-permissions.config';
import { GetRolesResponseDto } from './dto/get-roles-response.dto';

@Injectable()
export class RolesService {
    getRoles(): GetRolesResponseDto[] {
        return Object.entries(RolesDisplay).map(([key, value]) => {
            return { value: key, alias: value };
        });;
    }
}
