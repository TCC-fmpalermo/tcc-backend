import { Module } from '@nestjs/common';
import { DesktopOptionsController } from './desktop-options.controller';
import { DesktopOptionsService } from './desktop-options.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DesktopOption } from './entities/desktop-option.entity';
import { OpenstackModule } from 'src/openstack/openstack.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([DesktopOption]),
    OpenstackModule
  ],
  controllers: [DesktopOptionsController],
  providers: [DesktopOptionsService],
  exports: [DesktopOptionsService]
})
export class DesktopOptionsModule {}
