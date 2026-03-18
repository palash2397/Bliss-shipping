import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Vehicle, VehicleDocument } from './schemas/vehicle.schema';
import {
  DriverVehicle,
  DriverVehicleDocument,
} from './schemas/driver-vehicle.schema';
import { User, UserDocument } from '../user/schemas/user.schema';

import { ApiResponse } from 'src/utils/helpers/ApiResponse';
import { Msg } from 'src/utils/helpers/responseMsg';

import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { AssignVehicleDto } from './dto/assign-vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<VehicleDocument>,
    @InjectModel(DriverVehicle.name)
    private driverVehicleModel: Model<DriverVehicleDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createVehicle(dto: CreateVehicleDto) {
    try {
      const vehicle = await this.vehicleModel.create(dto);
      return new ApiResponse(201, vehicle, Msg.VEHICLE_CREATED);
    } catch (error) {
      console.log(`Error creating vehicle: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async allVehicles() {
    try {
      const vehicles = await this.vehicleModel.find({ isActive: true });
      if (!vehicles || vehicles.length === 0) {
        return new ApiResponse(404, {}, Msg.VEHICLES_NOT_FOUND);
      }
      return new ApiResponse(200, vehicles, Msg.VEHICLES_FETCHED);
    } catch (error) {
      console.log(`Error fetching vehicles: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async assignVehicle(driverId: string, vehicleId: string) {
    try {
      // deactivate old vehicle
      await this.driverVehicleModel.updateMany(
        { driverId },
        { isActive: false },
      );

      const data = await this.driverVehicleModel.create({
        driverId,
        vehicleId,
      });

      return new ApiResponse(201, data, Msg.VEHICLE_ASSIGNED);
    } catch (error) {
      console.log(`Error assigning vehicle: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
}
