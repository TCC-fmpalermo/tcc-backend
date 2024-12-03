import { PickType } from '@nestjs/mapped-types';
import { CreateCloudResourceDto } from './create-cloud-resource.dto';

export class UpdateCloudResourceAliasDto extends PickType(CreateCloudResourceDto, ['alias']) {}
