import { Migration } from '@mikro-orm/migrations';

export class Migration20241128163853 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "instance" add column "openstack_network_id" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "instance" drop column "openstack_network_id";`);
  }

}
