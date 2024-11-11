import { PickType } from "@nestjs/mapped-types";
import { Instance } from "../entities/instance.entity";

export class CreateInstanceDto extends PickType(Instance, [
  "ipAddress",
  "username",
  "password",
  "openstackInstanceId",
]) {}
