import { PickType } from "@nestjs/mapped-types";
import { User } from "../entities/user.entity";

export class CreateUserDto extends PickType(User, [
  "firstName",
  "lastName",
  "email",
  "password",
  "createdAt",
  "updatedAt",
  "status",
]) {
  roleId!: number;
}
