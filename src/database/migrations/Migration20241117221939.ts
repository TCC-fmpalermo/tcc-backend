import { Migration } from '@mikro-orm/migrations';

export class Migration20241117221939 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "role_permissions" drop constraint "role_permissions_permission_id_foreign";`);

    this.addSql(`alter table "role_permissions" drop constraint "role_permissions_role_id_foreign";`);

    this.addSql(`alter table "user" drop constraint "user_role_id_foreign";`);

    this.addSql(`drop table if exists "permission" cascade;`);

    this.addSql(`drop table if exists "role" cascade;`);

    this.addSql(`drop table if exists "role_permissions" cascade;`);

    this.addSql(`alter table "user" drop column "role_id";`);

    this.addSql(`alter table "user" add column "role" text check ("role" in ('Administrador', 'Usuário')) not null default 'Usuário';`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "permission" ("id" serial primary key, "name" varchar(255) not null, "description" varchar(255) null);`);
    this.addSql(`alter table "permission" add constraint "permission_name_unique" unique ("name");`);

    this.addSql(`create table "role" ("id" serial primary key, "name" varchar(255) not null);`);
    this.addSql(`alter table "role" add constraint "role_name_unique" unique ("name");`);

    this.addSql(`create table "role_permissions" ("role_id" int not null, "permission_id" int not null, constraint "role_permissions_pkey" primary key ("role_id", "permission_id"));`);

    this.addSql(`alter table "role_permissions" add constraint "role_permissions_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "role_permissions" add constraint "role_permissions_permission_id_foreign" foreign key ("permission_id") references "permission" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "user" drop column "role";`);

    this.addSql(`alter table "user" add column "role_id" int not null;`);
    this.addSql(`alter table "user" add constraint "user_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade;`);
  }

}
