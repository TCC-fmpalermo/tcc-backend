import { Entity, PrimaryKey, Property, ManyToMany, Collection, Unique } from "@mikro-orm/core";
import { Role } from "../../roles/entities/role.entity";

@Entity()
export class Permission {
  @PrimaryKey()
  id!: bigint;

  @Property()
  @Unique()
  name!: string;

  @Property({ nullable: true })
  description!: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles = new Collection<Role>(this);
}