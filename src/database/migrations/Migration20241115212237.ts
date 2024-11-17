import { Migration } from '@mikro-orm/migrations';

export class Migration20241115212237 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "instance" add column "name" varchar(255) not null;`);
    this.addSql(`alter table "instance" add constraint "instance_name_unique" unique ("name");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "instance" drop constraint "instance_name_unique";`);
    this.addSql(`alter table "instance" drop column "name";`);
  }

}
