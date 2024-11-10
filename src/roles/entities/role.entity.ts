import { Entity, PrimaryKey, Property, ManyToMany, Collection, Unique } from "@mikro-orm/core";
import { Permission } from "../../permissions/entities/permission.entity";

@Entity()
export class Role {
  @PrimaryKey()
  id!: bigint;

  @Property()
  @Unique()
  name!: string;

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    owner: true,
  })
  permissions = new Collection<Permission>(this);
}
