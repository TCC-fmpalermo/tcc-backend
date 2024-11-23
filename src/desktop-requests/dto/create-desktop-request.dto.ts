import { PickType } from "@nestjs/mapped-types";
import { DesktopRequest } from "../entities/desktop-request.entity";

export class CreateDesktopRequestDto extends PickType(DesktopRequest, [
  "user",
  "desktopOption",
  "status",
  "requestedAt",
  "finishedAt",
]) {}
