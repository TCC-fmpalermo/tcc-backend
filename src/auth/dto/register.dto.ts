import { PickType } from "@nestjs/mapped-types";
import { User } from "src/users/entities/user.entity";

export class RegisterDto extends PickType(User,[
    'firstName',
    'lastName',
    'email',
    'password'
]) {}