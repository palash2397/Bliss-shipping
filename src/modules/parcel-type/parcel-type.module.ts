import { Module } from '@nestjs/common';
import { ParcelTypeService } from './parcel-type.service';
import { ParcelTypeController } from './parcel-type.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { ParcelType, ParcelTypeSchema } from './schemas/parcel-type.schema';
import { Vehicle, VehicleSchema } from '../vehicle/schemas/vehicle.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ParcelType.name, schema: ParcelTypeSchema },
      { name: Vehicle.name, schema: VehicleSchema },
    ]),
  ],
  controllers: [ParcelTypeController],
  providers: [ParcelTypeService],
  exports: [
    ParcelTypeService,
    MongooseModule.forFeature([
      { name: ParcelType.name, schema: ParcelTypeSchema },
    ]),
  ],
})
export class ParcelTypeModule {}
