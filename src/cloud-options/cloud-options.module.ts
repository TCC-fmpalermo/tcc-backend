import { Module } from '@nestjs/common';
import { CloudOptionsService } from './cloud-options.service';
import { CloudOptionsController } from './cloud-options.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CloudOption } from './entities/cloud-option.entity';

@Module({
  imports: [MikroOrmModule.forFeature([CloudOption])],
  controllers: [CloudOptionsController],
  providers: [CloudOptionsService]
})
export class CloudOptionsModule {}
