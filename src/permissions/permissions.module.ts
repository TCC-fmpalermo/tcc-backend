import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Permission } from './entities/permission.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Permission])],
  controllers: [PermissionsController],
  providers: [PermissionsService]
})
export class PermissionsModule {}
