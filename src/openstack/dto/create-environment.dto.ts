interface CreateEnvironmentDto {
    instanceName: string;
    password: string;
    size: number;
    openstackFlavorId: string;
    openstackImageId: string;
}
