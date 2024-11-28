import { Migration } from '@mikro-orm/migrations';

export class Migration20241128164509 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "instance" alter column "openstack_network_id" type varchar(255) using ("openstack_network_id"::varchar(255));`);
    this.addSql(`alter table "instance" alter column "openstack_network_id" set not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "instance" alter column "openstack_network_id" type varchar(255) using ("openstack_network_id"::varchar(255));`);
    this.addSql(`alter table "instance" alter column "openstack_network_id" drop not null;`);
  }

}
