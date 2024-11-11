import { PickType } from "@nestjs/mapped-types";
import { CloudRequest } from "../entities/cloud-request.entity";

export class CreateCloudRequestDto extends PickType(CloudRequest, [
  "user",
  "cloudOption",
  "status",
  "requestedAt",
  "finishedAt",
]) {}
