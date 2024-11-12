import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { RolesModule } from './roles/roles.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PermissionsModule } from './permissions/permissions.module';
import { InstancesModule } from './instances/instances.module';
import { CloudOptionsModule } from './cloud-options/cloud-options.module';
import { VolumesModule } from './volumes/volumes.module';
import { CloudRequestsModule } from './cloud-requests/cloud-requests.module';
import { CloudResourcesModule } from './cloud-resources/cloud-resources.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MikroOrmModule.forRoot(),
    RolesModule,
    UsersModule,
    PermissionsModule,
    InstancesModule,
    CloudOptionsModule,
    VolumesModule,
    CloudRequestsModule,
    CloudResourcesModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
