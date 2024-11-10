import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { RolesModule } from './roles/roles.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MikroOrmModule.forRoot(),
    RolesModule,
    UsersModule,
    PermissionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
