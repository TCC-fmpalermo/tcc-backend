import {
    Entity,
    PrimaryKey,
    Property,
    ManyToOne,
    Enum,
    OneToOne,
  } from "@mikro-orm/core";
import { Instance } from "../../instances/entities/instance.entity";
import { User } from "../../users/entities/user.entity";
import { Volume } from "../../volumes/entities/volume.entity";
import { DesktopOption } from "../../desktop-options/entities/desktop-option.entity";
  
  export enum DesktopStatus {
    Ativo = 'Ativo',
    Inativo = 'Inativo',
  }
  
  @Entity()
  export class Desktop {
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
  
    @Enum(() => DesktopStatus)
    status: DesktopStatus = DesktopStatus.Ativo;
  
    @ManyToOne(() => User)
    user!: User;
  
    @OneToOne(() => Instance)
    instance!: Instance;
  
    @OneToOne(() => Volume)
    volume!: Volume;

    @ManyToOne(() => DesktopOption)
    desktopOption!: DesktopOption
  }
  