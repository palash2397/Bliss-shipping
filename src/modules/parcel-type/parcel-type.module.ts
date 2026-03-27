import { Module } from '@nestjs/common';
import { ParcelTypeService } from './parcel-type.service';
import { ParcelTypeController } from './parcel-type.controller';

@Module({
  controllers: [ParcelTypeController],
  providers: [ParcelTypeService],
})
export class ParcelTypeModule {}
