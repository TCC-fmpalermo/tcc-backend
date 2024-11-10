import { Migration } from '@mikro-orm/migrations';

export class Migration20241110144718 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "cloud_option" ("id" bigserial primary key, "operating_system" varchar(255) not null, "description" varchar(255) null, "size" bigint not null, "openstack_flavor_id" varchar(255) not null, "openstack_image_id" varchar(255) not null, "auto_approved" boolean not null, "status" text check ("status" in ('Ativo', 'Inativo')) not null default 'Ativo');`);

    this.addSql(`create table "instance" ("id" bigserial primary key, "ip_address" varchar(255) not null, "username" varchar(255) not null, "password" varchar(255) not null, "openstack_instance_id" varchar(255) not null);`);
    this.addSql(`alter table "instance" add constraint "instance_ip_address_unique" unique ("ip_address");`);

    this.addSql(`create table "permission" ("id" bigserial primary key, "name" varchar(255) not null, "description" varchar(255) null);`);
    this.addSql(`alter table "permission" add constraint "permission_name_unique" unique ("name");`);

    this.addSql(`create table "role" ("id" bigserial primary key, "name" varchar(255) not null);`);
    this.addSql(`alter table "role" add constraint "role_name_unique" unique ("name");`);

    this.addSql(`create table "role_permissions" ("role_id" bigint not null, "permission_id" bigint not null, constraint "role_permissions_pkey" primary key ("role_id", "permission_id"));`);

    this.addSql(`create table "user" ("id" bigserial primary key, "first_name" varchar(255) not null, "last_name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "role_id" bigint not null, "created_at" timestamptz not null, "updated_at" timestamptz null, "status" text check ("status" in ('Ativo', 'Pendente', 'Inativo')) not null default 'Pendente');`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);

    this.addSql(`create table "cloud_request" ("id" bigserial primary key, "user_id" bigint not null, "cloud_option_id" bigint not null, "status" text check ("status" in ('Pendente', 'Aprovado', 'Recusado')) not null default 'Pendente', "requested_at" timestamptz not null, "finished_at" timestamptz null);`);

    this.addSql(`create table "volume" ("id" bigserial primary key, "operating_system" varchar(255) not null, "size" bigint not null, "openstack_volume_id" varchar(255) not null, "openstack_image_id" varchar(255) not null);`);

    this.addSql(`create table "cloud_resource" ("id" bigserial primary key, "alias" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz null, "deleted_at" timestamptz null, "last_accessed_at" timestamptz null, "status" text check ("status" in ('Ativo', 'Inativo')) not null default 'Ativo', "user_id" bigint not null, "instance_id" bigint not null, "volume_id" bigint not null);`);

    this.addSql(`alter table "role_permissions" add constraint "role_permissions_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "role_permissions" add constraint "role_permissions_permission_id_foreign" foreign key ("permission_id") references "permission" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "user" add constraint "user_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade;`);

    this.addSql(`alter table "cloud_request" add constraint "cloud_request_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "cloud_request" add constraint "cloud_request_cloud_option_id_foreign" foreign key ("cloud_option_id") references "cloud_option" ("id") on update cascade;`);

    this.addSql(`alter table "cloud_resource" add constraint "cloud_resource_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "cloud_resource" add constraint "cloud_resource_instance_id_foreign" foreign key ("instance_id") references "instance" ("id") on update cascade;`);
    this.addSql(`alter table "cloud_resource" add constraint "cloud_resource_volume_id_foreign" foreign key ("volume_id") references "volume" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "cloud_request" drop constraint "cloud_request_cloud_option_id_foreign";`);

    this.addSql(`alter table "cloud_resource" drop constraint "cloud_resource_instance_id_foreign";`);

    this.addSql(`alter table "role_permissions" drop constraint "role_permissions_permission_id_foreign";`);

    this.addSql(`alter table "role_permissions" drop constraint "role_permissions_role_id_foreign";`);

    this.addSql(`alter table "user" drop constraint "user_role_id_foreign";`);

    this.addSql(`alter table "cloud_request" drop constraint "cloud_request_user_id_foreign";`);

    this.addSql(`alter table "cloud_resource" drop constraint "cloud_resource_user_id_foreign";`);

    this.addSql(`alter table "cloud_resource" drop constraint "cloud_resource_volume_id_foreign";`);

    this.addSql(`drop table if exists "cloud_option" cascade;`);

    this.addSql(`drop table if exists "instance" cascade;`);

    this.addSql(`drop table if exists "permission" cascade;`);

    this.addSql(`drop table if exists "role" cascade;`);

    this.addSql(`drop table if exists "role_permissions" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "cloud_request" cascade;`);

    this.addSql(`drop table if exists "volume" cascade;`);

    this.addSql(`drop table if exists "cloud_resource" cascade;`);
  }

}
