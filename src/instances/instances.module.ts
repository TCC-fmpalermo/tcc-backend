import { Module } from '@nestjs/common';
import { InstancesService } from './instances.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Instance } from './entities/instance.entity';
import { GuacamoleService } from './guacamole/guacamole.service';

@Module({
  imports: [MikroOrmModule.forFeature([Instance])],
  providers: [InstancesService, GuacamoleService],
  exports: [InstancesService, GuacamoleService],
})
export class InstancesModule {}
