import { Migration } from '@mikro-orm/migrations';

export class Migration20241205071326 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "desktop" ("id" serial primary key, "alias" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz null, "deleted_at" timestamptz null, "last_accessed_at" timestamptz null, "status" text check ("status" in ('Ativo', 'Inativo')) not null default 'Ativo', "user_id" int not null, "instance_id" int not null, "volume_id" int not null, "desktop_option_id" int not null);`);
    this.addSql(`alter table "desktop" add constraint "desktop_instance_id_unique" unique ("instance_id");`);
    this.addSql(`alter table "desktop" add constraint "desktop_volume_id_unique" unique ("volume_id");`);

    this.addSql(`alter table "desktop" add constraint "desktop_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "desktop" add constraint "desktop_instance_id_foreign" foreign key ("instance_id") references "instance" ("id") on update cascade;`);
    this.addSql(`alter table "desktop" add constraint "desktop_volume_id_foreign" foreign key ("volume_id") references "volume" ("id") on update cascade;`);
    this.addSql(`alter table "desktop" add constraint "desktop_desktop_option_id_foreign" foreign key ("desktop_option_id") references "desktop_option" ("id") on update cascade;`);

    this.addSql(`drop table if exists "cloud_resource" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "cloud_resource" ("id" serial primary key, "alias" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz null, "deleted_at" timestamptz null, "last_accessed_at" timestamptz null, "status" text check ("status" in ('Ativo', 'Inativo')) not null default 'Ativo', "user_id" int not null, "instance_id" int not null, "volume_id" int not null, "desktop_option_id" int not null);`);
    this.addSql(`alter table "cloud_resource" add constraint "cloud_resource_instance_id_unique" unique ("instance_id");`);
    this.addSql(`alter table "cloud_resource" add constraint "cloud_resource_volume_id_unique" unique ("volume_id");`);

    this.addSql(`alter table "cloud_resource" add constraint "cloud_resource_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "cloud_resource" add constraint "cloud_resource_instance_id_foreign" foreign key ("instance_id") references "instance" ("id") on update cascade;`);
    this.addSql(`alter table "cloud_resource" add constraint "cloud_resource_volume_id_foreign" foreign key ("volume_id") references "volume" ("id") on update cascade;`);
    this.addSql(`alter table "cloud_resource" add constraint "cloud_resource_desktop_option_id_foreign" foreign key ("desktop_option_id") references "desktop_option" ("id") on update cascade;`);

    this.addSql(`drop table if exists "desktop" cascade;`);
  }

}
