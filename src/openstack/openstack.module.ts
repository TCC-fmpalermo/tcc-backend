import { Module } from '@nestjs/common';
import { OpenstackService } from './openstack.service';
import { HttpModule } from '@nestjs/axios';
import { NetworkService } from './network/network.service';
import { IdentityService } from './identity/identity.service';
import { ComputeService } from './compute/compute.service';
import { VolumeService } from './volume/volume.service';

@Module({
  imports: [
    HttpModule
  ],
  providers: [OpenstackService, NetworkService, IdentityService, ComputeService, VolumeService],
  exports: [OpenstackService, ComputeService]
})
export class OpenstackModule {}
