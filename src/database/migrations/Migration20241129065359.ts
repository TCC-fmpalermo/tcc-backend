import { Migration } from '@mikro-orm/migrations';

export class Migration20241129065359 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "instance" add column "cpus" int not null, add column "ram" int not null, add column "openstack_flavor_id" varchar(255) not null;`);

    this.addSql(`alter table "volume" add column "size" int not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "instance" drop column "cpus", drop column "ram", drop column "openstack_flavor_id";`);

    this.addSql(`alter table "volume" drop column "size";`);
  }

}
