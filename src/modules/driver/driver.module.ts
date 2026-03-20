import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Order, OrderSchema } from '../orders/schemas/order.schema';
import { Vehicle, VehicleSchema } from '../vehicle/schemas/vehicle.schema';
import { DriverVehicle, DriverVehicleSchema } from '../vehicle/schemas/driver-vehicle.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]),
    MongooseModule.forFeature([{ name: DriverVehicle.name, schema: DriverVehicleSchema }]),
  ],
  controllers: [DriverController],
  providers: [DriverService],
})
export class DriverModule {}
