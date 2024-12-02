import { PickType } from '@nestjs/mapped-types';
import { CreateDesktopRequestDto } from './create-desktop-request.dto';
import { DesktopRequest } from '../entities/desktop-request.entity';

export class UpdateDesktopRequestDto extends PickType(DesktopRequest, ['status']) {}
