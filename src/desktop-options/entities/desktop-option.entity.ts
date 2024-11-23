import { Entity, PrimaryKey, Property, Enum } from "@mikro-orm/core";

export enum DesktopOptionStatus {
  Ativo = 'Ativo',
  Inativo = 'Inativo',
}

@Entity()
export class DesktopOption {
  @PrimaryKey()
  id!: number;

  @Property()
  operatingSystem!: string;

  @Property({ nullable: true })
  description?: string;

  @Property()
  size!: number;

  @Property()
  openstackFlavorId!: string;

  @Property()
  openstackImageId!: string;

  @Property()
  autoApproved!: boolean;

  @Enum(() => DesktopOptionStatus)
  status: DesktopOptionStatus = DesktopOptionStatus.Ativo;
}

