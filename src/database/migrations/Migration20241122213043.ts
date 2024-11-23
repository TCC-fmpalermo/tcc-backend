import { Migration } from '@mikro-orm/migrations';

export class Migration20241122213043 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "cloud_request" drop constraint "cloud_request_cloud_option_id_foreign";`);

    this.addSql(`create table "desktop_option" ("id" serial primary key, "operating_system" varchar(255) not null, "description" varchar(255) null, "size" int not null, "openstack_flavor_id" varchar(255) not null, "openstack_image_id" varchar(255) not null, "auto_approved" boolean not null, "status" text check ("status" in ('Ativo', 'Inativo')) not null default 'Ativo');`);

    this.addSql(`drop table if exists "cloud_option" cascade;`);

    this.addSql(`alter table "cloud_request" rename column "cloud_option_id" to "desktop_option_id";`);
    this.addSql(`alter table "cloud_request" add constraint "cloud_request_desktop_option_id_foreign" foreign key ("desktop_option_id") references "desktop_option" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "cloud_request" drop constraint "cloud_request_desktop_option_id_foreign";`);

    this.addSql(`create table "cloud_option" ("id" serial primary key, "operating_system" varchar(255) not null, "description" varchar(255) null, "size" int not null, "openstack_flavor_id" varchar(255) not null, "openstack_image_id" varchar(255) not null, "auto_approved" boolean not null, "status" text check ("status" in ('Ativo', 'Inativo')) not null default 'Ativo');`);

    this.addSql(`drop table if exists "desktop_option" cascade;`);

    this.addSql(`alter table "cloud_request" rename column "desktop_option_id" to "cloud_option_id";`);
    this.addSql(`alter table "cloud_request" add constraint "cloud_request_cloud_option_id_foreign" foreign key ("cloud_option_id") references "cloud_option" ("id") on update cascade;`);
  }

}
