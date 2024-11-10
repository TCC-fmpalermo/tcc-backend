import { Module } from '@nestjs/common';
import { CloudRequestsService } from './cloud-requests.service';
import { CloudRequestsController } from './cloud-requests.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CloudRequest } from './entities/cloud-request.entity';

@Module({
  imports: [MikroOrmModule.forFeature([CloudRequest])],
  controllers: [CloudRequestsController],
  providers: [CloudRequestsService]
})
export class CloudRequestsModule {}
