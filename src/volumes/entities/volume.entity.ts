import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Volume {
  @PrimaryKey()
  id!: number;

  @Property()
  operatingSystem!: string;

  @Property()
  size!: number;

  @Property()
  openstackVolumeId!: string;

  @Property()
  openstackImageId!: string;
}
