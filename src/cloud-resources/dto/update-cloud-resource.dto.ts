import { PartialType } from '@nestjs/mapped-types';
import { CreateCloudResourceDto } from './create-cloud-resource.dto';

export class UpdateCloudResourceDto extends PartialType(CreateCloudResourceDto) {}
