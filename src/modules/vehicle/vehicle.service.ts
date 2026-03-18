import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle, VehicleDocument } from './schemas/vehicle.schema';
import { DriverVehicle, DriverVehicleDocument } from './schemas/driver-vehicle.schema';
import { User, UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    @InjectModel(DriverVehicle.name) private driverVehicleModel: Model<DriverVehicleDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
}
