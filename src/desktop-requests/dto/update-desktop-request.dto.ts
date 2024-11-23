import { PartialType } from '@nestjs/mapped-types';
import { CreateDesktopRequestDto } from './create-desktop-request.dto';

export class UpdateDesktopRequestDto extends PartialType(CreateDesktopRequestDto) {}
