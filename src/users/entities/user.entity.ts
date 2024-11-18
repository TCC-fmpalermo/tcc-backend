import {
    Entity,
    PrimaryKey,
    Property,
    Enum,
    Unique,
} from "@mikro-orm/core";
  
export enum UserStatus {
  ACTIVE = 'Ativo',
  PENDING = 'Pendente',
  INACTIVE = 'Inativo',
}

export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property()
  @Unique()
  email!: string;

  @Property()
  password!: string;

  @Enum(() => UserRoles)
  role: UserRoles = UserRoles.USER;

  @Property()
  createdAt = new Date();

  @Property({ nullable: true, onUpdate: () => new Date() })
  updatedAt = new Date();

  @Enum(() => UserStatus)
  status: UserStatus = UserStatus.PENDING;
}
  