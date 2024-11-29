import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { InstancesModule } from './instances/instances.module';
import { VolumesModule } from './volumes/volumes.module';
import { DesktopRequestsModule } from './desktop-requests/desktop-requests.module';
import { CloudResourcesModule } from './cloud-resources/cloud-resources.module';
import { AuthModule } from './auth/auth.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { OpenstackModule } from './openstack/openstack.module';
import { DesktopOptionsModule } from './desktop-options/desktop-options.module';
import { ProgressModule } from './progress/progress.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MikroOrmModule.forRoot(),
    UsersModule,
    InstancesModule,
    DesktopOptionsModule,
    VolumesModule,
    DesktopRequestsModule,
    CloudResourcesModule,
    AuthModule,
    PermissionsModule,
    RolesModule,
    OpenstackModule,
    ProgressModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
