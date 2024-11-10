import { PartialType } from '@nestjs/mapped-types';
import { CreateCloudRequestDto } from './create-cloud-request.dto';

export class UpdateCloudRequestDto extends PartialType(CreateCloudRequestDto) {}
