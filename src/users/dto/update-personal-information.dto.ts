import { PickType } from "@nestjs/mapped-types";
import { User } from "../entities/user.entity";

export class UpdatePersonalInformationDto  extends PickType(User, ['firstName', 'lastName', 'password']) {}