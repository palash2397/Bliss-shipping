import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

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

import { Role } from 'src/common/enums/role.enum';

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

  async assignVehicle(driverId: string, dto: AssignVehicleDto) {
    try {
      const driver = await this.userModel.findOne({
        _id: new Types.ObjectId(driverId),
        role: Role.DRIVER,
      });
      if (!driver) {
        return new ApiResponse(404, {}, Msg.DRIVER_NOT_FOUND);
      }

      await this.driverVehicleModel.updateMany(
        { driverId: new Types.ObjectId(driverId) },
        { isActive: false },
      );

      const data = await this.driverVehicleModel.create({
        driverId: new Types.ObjectId(driverId),
        vehicleId: new Types.ObjectId(dto.vehicleId),
      });

      return new ApiResponse(201, data, Msg.VEHICLE_ASSIGNED);
    } catch (error) {
      console.log(`Error assigning vehicle: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
  

  async myAssignVehicle(driverId: string) {
    try {
      const driver = await this.userModel.findOne({
        _id: new Types.ObjectId(driverId),
        role: Role.DRIVER,
      });
      if (!driver) {
        return new ApiResponse(404, {}, Msg.DRIVER_NOT_FOUND);
      }
      
      const driverVehicle = await this.driverVehicleModel.findOne({
        driverId: new Types.ObjectId(driverId),
        isActive: true,
      }).populate('vehicleId')
      
      if (!driverVehicle) {
        return new ApiResponse(404, {}, Msg.ASSIGNED_VEHICLES_NOT_FOUND);
      }
      
    //   const vehicle = await this.vehicleModel.findOne({
    //     _id: new Types.ObjectId(driverVehicle.vehicleId),
    //     isActive: true,
    //   });
      
    //   if (!vehicle) {
    //     return new ApiResponse(404, {}, Msg.VEHICLE_NOT_FOUND);
    //   }
      
      return new ApiResponse(200, driverVehicle, Msg.VEHICLE_FETCHED);
    } catch (error) {
      console.log(`Error fetching assigned vehicle: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
  
}
