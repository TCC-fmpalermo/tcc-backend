import { PickType } from "@nestjs/mapped-types";
import { Desktop } from "../entities/desktop.entity";

export class CreateDesktopDto extends PickType(Desktop, [
  "alias",
]) {
  desktopOptionId: number;  
}
