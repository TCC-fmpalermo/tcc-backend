import { Migration } from '@mikro-orm/migrations';

export class Migration20241117214123 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "role_permissions" drop constraint "role_permissions_role_id_foreign";`);
    this.addSql(`alter table "role_permissions" drop constraint "role_permissions_permission_id_foreign";`);

    this.addSql(`alter table "user" drop constraint "user_role_id_foreign";`);

    this.addSql(`alter table "cloud_request" drop constraint "cloud_request_user_id_foreign";`);
    this.addSql(`alter table "cloud_request" drop constraint "cloud_request_cloud_option_id_foreign";`);

    this.addSql(`alter table "cloud_resource" drop constraint "cloud_resource_user_id_foreign";`);
    this.addSql(`alter table "cloud_resource" drop constraint "cloud_resource_instance_id_foreign";`);
    this.addSql(`alter table "cloud_resource" drop constraint "cloud_resource_volume_id_foreign";`);

    this.addSql(`alter table "cloud_option" alter column "id" type int using ("id"::int);`);
    this.addSql(`alter table "cloud_option" alter column "size" type int using ("size"::int);`);

    this.addSql(`alter table "instance" alter column "id" type int using ("id"::int);`);

    this.addSql(`alter table "permission" alter column "id" type int using ("id"::int);`);

    this.addSql(`alter table "role" alter column "id" type int using ("id"::int);`);

    this.addSql(`alter table "role_permissions" alter column "role_id" type int using ("role_id"::int);`);
    this.addSql(`alter table "role_permissions" alter column "permission_id" type int using ("permission_id"::int);`);
    this.addSql(`alter table "role_permissions" add constraint "role_permissions_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "role_permissions" add constraint "role_permissions_permission_id_foreign" foreign key ("permission_id") references "permission" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "user" alter column "id" type int using ("id"::int);`);
    this.addSql(`alter table "user" alter column "role_id" type int using ("role_id"::int);`);
    this.addSql(`alter table "user" add constraint "user_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade;`);

    this.addSql(`alter table "cloud_request" alter column "id" type int using ("id"::int);`);
    this.addSql(`alter table "cloud_request" alter column "user_id" type int using ("user_id"::int);`);
    this.addSql(`alter table "cloud_request" alter column "cloud_option_id" type int using ("cloud_option_id"::int);`);
    this.addSql(`alter table "cloud_request" add constraint "cloud_request_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "cloud_request" add constraint "cloud_request_cloud_option_id_foreign" foreign key ("cloud_option_id") references "cloud_option" ("id") on update cascade;`);

    this.addSql(`alter table "volume" alter column "id" type int using ("id"::int);`);
    this.addSql(`alter table "volume" alter column "size" type int using ("size"::int);`);

    this.addSql(`alter table "cloud_resource" alter column "id" type int using ("id"::int);`);
    this.addSql(`alter table "cloud_resource" alter column "user_id" type int using ("user_id"::int);`);
    this.addSql(`alter table "cloud_resource" alter column "instance_id" type int using ("instance_id"::int);`);
    this.addSql(`alter table "cloud_resource" alter column "volume_id" type int using ("volume_id"::int);`);
    this.addSql(`alter table "cloud_resource" add constraint "cloud_resource_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "cloud_resource" add constraint "cloud_resource_instance_id_foreign" foreign key ("instance_id") references "instance" ("id") on update cascade;`);
    this.addSql(`alter table "cloud_resource" add constraint "cloud_resource_volume_id_foreign" foreign key ("volume_id") references "volume" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "role_permissions" drop constraint "role_permissions_role_id_foreign";`);
    this.addSql(`alter table "role_permissions" drop constraint "role_permissions_permission_id_foreign";`);

    this.addSql(`alter table "user" drop constraint "user_role_id_foreign";`);

    this.addSql(`alter table "cloud_request" drop constraint "cloud_request_user_id_foreign";`);
    this.addSql(`alter table "cloud_request" drop constraint "cloud_request_cloud_option_id_foreign";`);

    this.addSql(`alter table "cloud_resource" drop constraint "cloud_resource_user_id_foreign";`);
    this.addSql(`alter table "cloud_resource" drop constraint "cloud_resource_instance_id_foreign";`);
    this.addSql(`alter table "cloud_resource" drop constraint "cloud_resource_volume_id_foreign";`);

    this.addSql(`alter table "cloud_option" alter column "id" type bigint using ("id"::bigint);`);
    this.addSql(`alter table "cloud_option" alter column "size" type bigint using ("size"::bigint);`);

    this.addSql(`alter table "instance" alter column "id" type bigint using ("id"::bigint);`);

    this.addSql(`alter table "permission" alter column "id" type bigint using ("id"::bigint);`);

    this.addSql(`alter table "role" alter column "id" type bigint using ("id"::bigint);`);

    this.addSql(`alter table "role_permissions" alter column "role_id" type bigint using ("role_id"::bigint);`);
    this.addSql(`alter table "role_permissions" alter column "permission_id" type bigint using ("permission_id"::bigint);`);
    this.addSql(`alter table "role_permissions" add constraint "role_permissions_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "role_permissions" add constraint "role_permissions_permission_id_foreign" foreign key ("permission_id") references "permission" ("id") on update cascade on delete cascade;`);

    this.addSql(`alter table "user" alter column "id" type bigint using ("id"::bigint);`);
    this.addSql(`alter table "user" alter column "role_id" type bigint using ("role_id"::bigint);`);
    this.addSql(`alter table "user" add constraint "user_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade;`);

    this.addSql(`alter table "cloud_request" alter column "id" type bigint using ("id"::bigint);`);
    this.addSql(`alter table "cloud_request" alter column "user_id" type bigint using ("user_id"::bigint);`);
    this.addSql(`alter table "cloud_request" alter column "cloud_option_id" type bigint using ("cloud_option_id"::bigint);`);
    this.addSql(`alter table "cloud_request" add constraint "cloud_request_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "cloud_request" add constraint "cloud_request_cloud_option_id_foreign" foreign key ("cloud_option_id") references "cloud_option" ("id") on update cascade;`);

    this.addSql(`alter table "volume" alter column "id" type bigint using ("id"::bigint);`);
    this.addSql(`alter table "volume" alter column "size" type bigint using ("size"::bigint);`);

    this.addSql(`alter table "cloud_resource" alter column "id" type bigint using ("id"::bigint);`);
    this.addSql(`alter table "cloud_resource" alter column "user_id" type bigint using ("user_id"::bigint);`);
    this.addSql(`alter table "cloud_resource" alter column "instance_id" type bigint using ("instance_id"::bigint);`);
    this.addSql(`alter table "cloud_resource" alter column "volume_id" type bigint using ("volume_id"::bigint);`);
    this.addSql(`alter table "cloud_resource" add constraint "cloud_resource_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "cloud_resource" add constraint "cloud_resource_instance_id_foreign" foreign key ("instance_id") references "instance" ("id") on update cascade;`);
    this.addSql(`alter table "cloud_resource" add constraint "cloud_resource_volume_id_foreign" foreign key ("volume_id") references "volume" ("id") on update cascade;`);
  }

}
