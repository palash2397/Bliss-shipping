import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ParcelType, ParcelTypeDocument } from './schemas/parcel-type.schema';
import { Vehicle, VehicleDocument } from '../vehicle/schemas/vehicle.schema';

import { ApiResponse } from 'src/utils/helpers/ApiResponse';
import { Msg } from 'src/utils/helpers/responseMsg';

import { CreateParcelTypeDto } from './dto/create-parcel-type.dto';

@Injectable()
export class ParcelTypeService {
  constructor(
    @InjectModel(ParcelType.name)
    private parcelTypeModel: Model<ParcelTypeDocument>,
    @InjectModel(Vehicle.name)
    private vehicleModel: Model<VehicleDocument>,
  ) {}

  async create(createParcelTypeDto: CreateParcelTypeDto) {
    try {
      const vehicle = await this.vehicleModel
        .findById(createParcelTypeDto.recommendedVehicleId)
        .exec();
      if (!vehicle) {
        return new ApiResponse(404, {}, Msg.VEHICLE_NOT_FOUND);
      }

      const parcelType = new this.parcelTypeModel(createParcelTypeDto);
      await parcelType.save();

      return new ApiResponse(201, parcelType, Msg.PARCEL_TYPE_CREATED);
    } catch (error) {
      console.log(`error creating parcel type: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async findAll() {
    try {
      const parcelTypes = await this.parcelTypeModel
        .find()
        .populate('recommendedVehicleId', 'name description')
        .exec();
      if (!parcelTypes || parcelTypes.length === 0) {
        return new ApiResponse(404, {}, Msg.PARCEL_TYPES_NOT_FOUND);
      }
      return new ApiResponse(200, parcelTypes, Msg.PARCEL_TYPES_FETCHED);
    } catch (error) {
      console.log(`error fetching parcel types: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async findOne(id: string) {
    try {
      const parcelType = await this.parcelTypeModel.findById(id).exec();
      if (!parcelType) {
        return new ApiResponse(404, {}, Msg.PARCEL_TYPE_NOT_FOUND);
      }
      return new ApiResponse(200, parcelType, Msg.PARCEL_TYPE_FETCHED);
    } catch (error) {
      console.log(`error fetching parcel type: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  //   async update(id: string, updateParcelTypeDto: any) {
  //     return this.parcelTypeModel.findByIdAndUpdate(id, updateParcelTypeDto, { new: true }).exec();
  //   }
}
