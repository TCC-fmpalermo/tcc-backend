import { PickType } from "@nestjs/mapped-types";
import { Permission } from "../entities/permission.entity";

export class CreatePermissionDto extends PickType(Permission, [
  "name",
  "description",
]) {}
