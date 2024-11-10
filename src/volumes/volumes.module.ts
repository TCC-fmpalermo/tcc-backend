import { Module } from '@nestjs/common';
import { VolumesService } from './volumes.service';
import { VolumesController } from './volumes.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Volume } from './entities/volume.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Volume])],
  controllers: [VolumesController],
  providers: [VolumesService]
})
export class VolumesModule {}
