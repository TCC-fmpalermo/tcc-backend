import { PickType } from "@nestjs/mapped-types";
import { CloudOption } from "../entities/cloud-option.entity";

export class CreateCloudOptionDto extends PickType(CloudOption, [
  "operatingSystem",
  "description",
  "size",
  "openstackFlavorId",
  "openstackImageId",
  "autoApproved",
  "status",
]) {}
