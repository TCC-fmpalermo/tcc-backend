import { PickType } from "@nestjs/mapped-types";
import { Role } from "../entities/role.entity";

export class CreateRoleDto extends PickType(Role, ['name']) {}
