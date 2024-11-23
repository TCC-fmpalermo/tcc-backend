import { PartialType } from '@nestjs/mapped-types';
import { CreateDesktopOptionDto } from './create-desktop-option.dto';

export class UpdateDesktopOptionDto extends PartialType(CreateDesktopOptionDto) {}
