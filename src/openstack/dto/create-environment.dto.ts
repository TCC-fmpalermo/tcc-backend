interface CreateEnvironmentDto {
    userId: number;
    instanceName: string;
    password: string;
    size: number;
    openstackFlavorId: string;
    openstackImageId: string;
}
