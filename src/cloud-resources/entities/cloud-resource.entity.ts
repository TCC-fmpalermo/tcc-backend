import {
    Entity,
    PrimaryKey,
    Property,
    ManyToOne,
    Enum,
  } from "@mikro-orm/core";
import { Instance } from "../../instances/entities/instance.entity";
import { User } from "../../users/entities/user.entity";
import { Volume } from "../../volumes/entities/volume.entity";
  
  export enum CloudResourceStatus {
    Ativo = 'Ativo',
    Inativo = 'Inativo',
  }
  
  @Entity()
  export class CloudResource {
    @PrimaryKey()
    id!: number;
  
    @Property()
    alias!: string;
  
    @Property()
    createdAt = new Date();;
  
    @Property({ nullable: true, onUpdate: () => new Date() })
    updatedAt = new Date();
  
    @Property({ nullable: true })
    deletedAt?: Date;
  
    @Property({ nullable: true })
    lastAccessedAt?: Date;
  
    @Enum(() => CloudResourceStatus)
    status: CloudResourceStatus = CloudResourceStatus.Ativo;
  
    @ManyToOne(() => User)
    user!: User;
  
    @ManyToOne(() => Instance)
    instance!: Instance;
  
    @ManyToOne(() => Volume)
    volume!: Volume;
  }
  