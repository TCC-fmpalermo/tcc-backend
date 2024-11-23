import { Module } from '@nestjs/common';
import { DesktopRequestsService } from './desktop-requests.service';
import { DesktopRequestsController } from './desktop-requests.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DesktopRequest } from './entities/desktop-request.entity';

@Module({
  imports: [MikroOrmModule.forFeature([DesktopRequest])],
  controllers: [DesktopRequestsController],
  providers: [DesktopRequestsService]
})
export class DesktopRequestsModule {}
