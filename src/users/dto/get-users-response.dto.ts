import { PickType } from "@nestjs/mapped-types";
import { User } from "../entities/user.entity";
import { GetRolesResponseDto } from "src/roles/dto/get-roles-response.dto";

export class GetUsersResponseDto extends PickType(User, [
    'id',
    'firstName',
    'lastName', 
    'email', 
    'status',
    'updatedAt',
]) {
    role!: GetRolesResponseDto;
    createdAt!: string;
}
