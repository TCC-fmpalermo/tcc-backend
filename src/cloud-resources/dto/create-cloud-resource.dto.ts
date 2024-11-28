import { PickType } from "@nestjs/mapped-types";
import { CloudResource } from "../entities/cloud-resource.entity";

export class CreateCloudResourceDto extends PickType(CloudResource, [
  "alias",
]) {
  desktopOptionId: number;  
}
