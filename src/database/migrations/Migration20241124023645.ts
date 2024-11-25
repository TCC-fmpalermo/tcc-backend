import { Migration } from '@mikro-orm/migrations';

export class Migration20241124023645 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "cloud_resource" add column "desktop_option_id" int not null;`);
    this.addSql(`alter table "cloud_resource" add constraint "cloud_resource_desktop_option_id_foreign" foreign key ("desktop_option_id") references "desktop_option" ("id") on update cascade;`);
    this.addSql(`alter table "cloud_resource" add constraint "cloud_resource_instance_id_unique" unique ("instance_id");`);
    this.addSql(`alter table "cloud_resource" add constraint "cloud_resource_volume_id_unique" unique ("volume_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "cloud_resource" drop constraint "cloud_resource_desktop_option_id_foreign";`);

    this.addSql(`alter table "cloud_resource" drop constraint "cloud_resource_instance_id_unique";`);
    this.addSql(`alter table "cloud_resource" drop constraint "cloud_resource_volume_id_unique";`);
    this.addSql(`alter table "cloud_resource" drop column "desktop_option_id";`);
  }

}
