import { defineConfig } from '@mikro-orm/postgresql';

export default defineConfig({
  host: "pgsql",
  user: "postgres",
  password: "postgres",
  dbName: "tcc",
  port: 5432,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  migrations: {
    path: 'dist/database/migrations',
    pathTs: 'src/database/migrations',
  }
});
