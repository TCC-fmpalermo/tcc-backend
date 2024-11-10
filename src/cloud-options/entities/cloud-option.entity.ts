import { Entity, PrimaryKey, Property, Enum } from "@mikro-orm/core";

export enum CloudOptionStatus {
  Ativo = 'Ativo',
  Inativo = 'Inativo',
}

@Entity()
export class CloudOption {
  @PrimaryKey()
  id!: bigint;

  @Property()
  operatingSystem!: string;

  @Property({ nullable: true })
  description?: string;

  @Property()
  size!: bigint;

  @Property()
  openstackFlavorId!: string;

  @Property()
  openstackImageId!: string;

  @Property()
  autoApproved!: boolean;

  @Enum(() => CloudOptionStatus)
  status: CloudOptionStatus = CloudOptionStatus.Ativo;
}

