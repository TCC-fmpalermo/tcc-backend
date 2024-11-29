import { Module } from '@nestjs/common';
import { CloudResourcesService } from './cloud-resources.service';
import { CloudResourcesController } from './cloud-resources.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CloudResource } from './entities/cloud-resource.entity';
import { OpenstackModule } from 'src/openstack/openstack.module';
import { DesktopOptionsModule } from 'src/desktop-options/desktop-options.module';
import { InstancesModule } from 'src/instances/instances.module';
import { VolumesModule } from 'src/volumes/volumes.module';
import { ProgressModule } from 'src/progress/progress.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([CloudResource]),
    DesktopOptionsModule,
    OpenstackModule,
    InstancesModule,
    VolumesModule,
    ProgressModule
  ],
  controllers: [CloudResourcesController],
  providers: [CloudResourcesService]
})
export class CloudResourcesModule {}
