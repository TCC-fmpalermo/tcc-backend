import { Entity, PrimaryKey, Property, Unique } from "@mikro-orm/core";

@Entity()
export class Instance {
  @PrimaryKey()
  id!: number;

  @Property()
  @Unique()
  name!: string;

  @Property()
  @Unique()
  ipAddress!: string;

  @Property()
  username!: string;

  @Property()
  password!: string;

  @Property()
  cpus!: number;

  @Property()
  ram!: number;

  @Property()
  openstackFlavorId!: string;

  @Property()
  openstackNetworkId!: string;

  @Property()
  openstackInstanceId!: string;
}

