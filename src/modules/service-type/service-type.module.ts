import { Module } from '@nestjs/common';
import { ServiceTypeService } from './service-type.service';
import { ServiceTypeController } from './service-type.controller';

@Module({
  controllers: [ServiceTypeController],
  providers: [ServiceTypeService],
})
export class ServiceTypeModule {}
