import { PickType } from "@nestjs/mapped-types";
import { DesktopOption } from "../entities/desktop-option.entity";

export class CreateDesktopOptionDto extends PickType(DesktopOption, [
  "description",
  "size",
  "openstackFlavorId",
  "openstackImageId",
  "autoApproved",
  "status",
  "defaultUsername",
]) {}
