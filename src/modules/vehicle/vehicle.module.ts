import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Vehicle, VehicleSchema } from './schemas/vehicle.schema';
import { DriverVehicle, DriverVehicleSchema } from './schemas/driver-vehicle.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { ParcelType, ParcelTypeSchema } from '../parcel-type/schemas/parcel-type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Vehicle.name, schema: VehicleSchema },
      { name: DriverVehicle.name, schema: DriverVehicleSchema },
      { name: User.name, schema: UserSchema },
      { name: ParcelType.name, schema: ParcelTypeSchema },
    ]),
  ],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class VehicleModule {}
