import { Migration } from '@mikro-orm/migrations';

export class Migration20241128200448 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "desktop_option" drop column "operating_system";`);

    this.addSql(`alter table "volume" drop column "operating_system";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "desktop_option" add column "operating_system" varchar(255) not null;`);

    this.addSql(`alter table "volume" add column "operating_system" varchar(255) not null;`);
  }

}
