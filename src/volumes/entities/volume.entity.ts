import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Volume {
  @PrimaryKey()
  id!: bigint;

  @Property()
  operatingSystem!: string;

  @Property()
  size!: bigint;

  @Property()
  openstackVolumeId!: string;

  @Property()
  openstackImageId!: string;
}
