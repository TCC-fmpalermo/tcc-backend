import { PickType } from "@nestjs/mapped-types";
import { Volume } from "../entities/volume.entity";

export class CreateVolumeDto extends PickType(Volume, [
  "openstackVolumeId",
  "openstackImageId",
  "size",
]) {}
