import { PartialType } from '@nestjs/mapped-types';
import { CreateCloudOptionDto } from './create-cloud-option.dto';

export class UpdateCloudOptionDto extends PartialType(CreateCloudOptionDto) {}
