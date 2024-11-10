import { Module } from '@nestjs/common';
import { CloudResourcesService } from './cloud-resources.service';
import { CloudResourcesController } from './cloud-resources.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CloudResource } from './entities/cloud-resource.entity';

@Module({
  imports: [MikroOrmModule.forFeature([CloudResource])],
  controllers: [CloudResourcesController],
  providers: [CloudResourcesService]
})
export class CloudResourcesModule {}
