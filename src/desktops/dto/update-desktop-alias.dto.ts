import { PickType } from '@nestjs/mapped-types';
import { CreateDesktopDto } from './create-desktop.dto';

export class UpdateDesktopAliasDto extends PickType(CreateDesktopDto, ['alias']) {}
