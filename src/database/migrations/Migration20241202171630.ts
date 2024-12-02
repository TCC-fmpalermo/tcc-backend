import { Migration } from '@mikro-orm/migrations';

export class Migration20241202171630 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "desktop_request" add column "objective" varchar(255) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "desktop_request" drop column "objective";`);
  }

}
