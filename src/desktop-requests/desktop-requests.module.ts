import { Module } from '@nestjs/common';
import { DesktopRequestsService } from './desktop-requests.service';
import { DesktopRequestsController } from './desktop-requests.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DesktopRequest } from './entities/desktop-request.entity';
import { DesktopOptionsModule } from 'src/desktop-options/desktop-options.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([DesktopRequest]),
    DesktopOptionsModule
  ],
  controllers: [DesktopRequestsController],
  providers: [DesktopRequestsService]
})
export class DesktopRequestsModule {}
