import { PickType } from "@nestjs/mapped-types";
import { Desktop } from "../entities/desktop.entity";

export class UpdateDesktopStatusDto extends PickType(Desktop, ['status']) {}