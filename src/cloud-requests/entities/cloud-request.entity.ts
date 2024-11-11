import {
    Entity,
    PrimaryKey,
    Property,
    ManyToOne,
    Enum,
  } from "@mikro-orm/core";
import { CloudOption } from "../../cloud-options/entities/cloud-option.entity";
import { User } from "../../users/entities/user.entity";
  
  export enum CloudRequestStatus {
    Pendente = 'Pendente',
    Aprovado = 'Aprovado',
    Recusado = 'Recusado',
  }
  
  @Entity()
  export class CloudRequest {
    @PrimaryKey()
    id!: bigint;
  
    @ManyToOne(() => User)
    user!: User;
  
    @ManyToOne(() => CloudOption)
    cloudOption!: CloudOption;
  
    @Enum(() => CloudRequestStatus)
    status: CloudRequestStatus = CloudRequestStatus.Pendente;
  
    @Property()
    requestedAt = new Date();
  
    @Property({ nullable: true })
    finishedAt?: Date;
  }
  