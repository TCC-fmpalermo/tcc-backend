import { PickType } from "@nestjs/mapped-types";
import { Instance } from "../entities/instance.entity";

export class CreateInstanceDto extends PickType(Instance, [
  "name",
  "ipAddress",
  "username",
  "password",
  "openstackInstanceId",
  "openstackNetworkId",
  "openstackFlavorId",
  "cpus",
  "ram",
]) {}
