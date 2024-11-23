import {
    Entity,
    PrimaryKey,
    Property,
    ManyToOne,
    Enum,
  } from "@mikro-orm/core";
import { DesktopOption } from "../../desktop-options/entities/desktop-option.entity";
import { User } from "../../users/entities/user.entity";
  
  export enum DesktopRequestStatus {
    Pendente = 'Pendente',
    Aprovado = 'Aprovado',
    Recusado = 'Recusado',
  }
  
  @Entity()
  export class DesktopRequest {
    @PrimaryKey()
    id!: number;
  
    @ManyToOne(() => User)
    user!: User;
  
    @ManyToOne(() => DesktopOption)
    desktopOption!: DesktopOption;
  
    @Enum(() => DesktopRequestStatus)
    status: DesktopRequestStatus = DesktopRequestStatus.Pendente;
  
    @Property()
    requestedAt = new Date();
  
    @Property({ nullable: true })
    finishedAt?: Date;
  }
  