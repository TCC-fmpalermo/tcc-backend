import { PickType } from "@nestjs/mapped-types";
import { CloudResource } from "../entities/cloud-resource.entity";

export class CreateCloudResourceDto extends PickType(CloudResource, [
  "alias",
  "createdAt",
  "updatedAt",
  "deletedAt",
  "lastAccessedAt",
  "status",
  "user",
  "instance",
  "volume",
]) {}
