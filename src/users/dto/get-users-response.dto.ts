import { PickType } from "@nestjs/mapped-types";
import { User } from "../entities/user.entity";

export class GetUsersResponseDto extends PickType(User, [
    'id',
    'firstName',
    'lastName', 
    'email', 
    'status',
    'updatedAt',
]) {
    role!: string;
    createdAt!: string;
}
