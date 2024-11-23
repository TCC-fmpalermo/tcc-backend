import { Migration } from '@mikro-orm/migrations';

export class Migration20241123024826 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "desktop_request" ("id" serial primary key, "user_id" int not null, "desktop_option_id" int not null, "status" text check ("status" in ('Pendente', 'Aprovado', 'Recusado')) not null default 'Pendente', "requested_at" timestamptz not null, "finished_at" timestamptz null);`);

    this.addSql(`alter table "desktop_request" add constraint "desktop_request_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "desktop_request" add constraint "desktop_request_desktop_option_id_foreign" foreign key ("desktop_option_id") references "desktop_option" ("id") on update cascade;`);

    this.addSql(`drop table if exists "cloud_request" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "cloud_request" ("id" serial primary key, "user_id" int not null, "desktop_option_id" int not null, "status" text check ("status" in ('Pendente', 'Aprovado', 'Recusado')) not null default 'Pendente', "requested_at" timestamptz not null, "finished_at" timestamptz null);`);

    this.addSql(`alter table "cloud_request" add constraint "cloud_request_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "cloud_request" add constraint "cloud_request_desktop_option_id_foreign" foreign key ("desktop_option_id") references "desktop_option" ("id") on update cascade;`);

    this.addSql(`drop table if exists "desktop_request" cascade;`);
  }

}
