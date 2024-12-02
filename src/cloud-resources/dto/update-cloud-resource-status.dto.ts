import { PickType } from "@nestjs/mapped-types";
import { CloudResource } from "../entities/cloud-resource.entity";

export class UpdateCloudResourceStatusDto extends PickType(CloudResource, ['status']) {}