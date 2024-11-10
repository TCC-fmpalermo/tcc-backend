import {
    Entity,
    PrimaryKey,
    Property,
    ManyToOne,
    Enum,
    Unique,
  } from "@mikro-orm/core";
import { Role } from "../../roles/entities/role.entity";
  
  export enum UserStatus {
    Ativo = 'Ativo',
    Pendente = 'Pendente',
    Inativo = 'Inativo',
  }
  
  @Entity()
  export class User {
    @PrimaryKey()
    id!: bigint;
  
    @Property()
    firstName!: string;
  
    @Property()
    lastName!: string;
  
    @Property()
    @Unique()
    email!: string;
  
    @Property()
    password!: string;
  
    @ManyToOne(() => Role)
    role!: Role;
  
    @Property()
    createdAt!: Date;
  
    @Property({ nullable: true })
    updatedAt?: Date;
  
    @Enum(() => UserStatus)
    status: UserStatus = UserStatus.Pendente;
  }
  