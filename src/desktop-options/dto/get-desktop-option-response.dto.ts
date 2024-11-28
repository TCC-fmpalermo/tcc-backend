import { PickType } from "@nestjs/mapped-types";
import { DesktopOption } from "../entities/desktop-option.entity";

type FlavorSpecs = {
    id: string;
    name: string;
    vcpus: string;
    ram: string;
}

type ImageInfo = {
    id: string;
    name: string;
    size: string;
}
export class GetDesktopOptionResponseDto extends PickType(DesktopOption, [
    'id', 
    'description',
    'openstackFlavorId',
    'openstackImageId',
    'autoApproved',
    'status'
]){
    size: string;
    flavorSpecs: FlavorSpecs;
    imageInfo: ImageInfo;
}