import { Module } from '@nestjs/common';
import { DesktopsService } from './desktops.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Desktop } from './entities/desktop.entity';
import { OpenstackModule } from 'src/openstack/openstack.module';
import { DesktopOptionsModule } from 'src/desktop-options/desktop-options.module';
import { InstancesModule } from 'src/instances/instances.module';
import { VolumesModule } from 'src/volumes/volumes.module';
import { ProgressModule } from 'src/progress/progress.module';
import { DesktopsController } from './desktops.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([Desktop]),
    DesktopOptionsModule,
    OpenstackModule,
    InstancesModule,
    VolumesModule,
    ProgressModule
  ],
  controllers: [DesktopsController],
  providers: [DesktopsService]
})
export class DesktopsModule {}
