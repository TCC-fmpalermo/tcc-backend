import { Module } from '@nestjs/common';
import { VolumesService } from './volumes.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Volume } from './entities/volume.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Volume])],
  providers: [VolumesService],
  exports: [VolumesService],
})
export class VolumesModule {}
