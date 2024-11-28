import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Volume {
  @PrimaryKey()
  id!: number;

  @Property()
  openstackVolumeId!: string;

  @Property()
  openstackImageId!: string;
}
