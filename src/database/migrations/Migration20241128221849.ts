import { Migration } from '@mikro-orm/migrations';

export class Migration20241128221849 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "desktop_option" add column "default_username" varchar(255) not null default 'ubuntu';`);

    this.addSql(`alter table "volume" drop column "size";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "desktop_option" drop column "default_username";`);

    this.addSql(`alter table "volume" add column "size" int not null;`);
  }

}
