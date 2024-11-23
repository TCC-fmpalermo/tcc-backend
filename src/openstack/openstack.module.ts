import { Module } from '@nestjs/common';
import { OpenstackService } from './openstack.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule
  ],
  providers: [OpenstackService],
  exports: [OpenstackService]
})
export class OpenstackModule {}
