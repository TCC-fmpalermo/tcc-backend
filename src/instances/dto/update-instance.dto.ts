import { PartialType } from '@nestjs/mapped-types';
import { CreateInstanceDto } from './create-instance.dto';

export class UpdateInstanceDto extends PartialType(CreateInstanceDto) {}
