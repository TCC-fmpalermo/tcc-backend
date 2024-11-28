import { Module } from '@nestjs/common';
import { InstancesService } from './instances.service';
import { InstancesController } from './instances.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Instance } from './entities/instance.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Instance])],
  controllers: [InstancesController],
  providers: [InstancesService],
  exports: [InstancesService],
})
export class InstancesModule {}
