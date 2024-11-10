import { Entity, PrimaryKey, Property, Unique } from "@mikro-orm/core";

@Entity()
export class Instance {
  @PrimaryKey()
  id!: bigint;

  @Property()
  @Unique()
  ipAddress!: string;

  @Property()
  username!: string;

  @Property()
  password!: string;

  @Property()
  openstackInstanceId!: string;
}

