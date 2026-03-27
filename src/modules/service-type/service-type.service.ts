import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Connection } from 'mongoose';

import { ServiceType, ServiceTypeDocument } from './schemas/service-type';
import { User, UserDocument } from '../user/schemas/user.schema';

import { ApiResponse } from 'src/utils/helpers/ApiResponse';
import { Msg } from 'src/utils/helpers/responseMsg';

import { CreateServiceTypeDto } from './dto/create-service-type.dto';

@Injectable()
export class ServiceTypeService {
  constructor(
    @InjectModel(ServiceType.name)
    private readonly serviceTypeModel: Model<ServiceTypeDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createServiceTypeDto: CreateServiceTypeDto) {
    try {
      const serviceType = new this.serviceTypeModel(createServiceTypeDto);
      await serviceType.save();
      return new ApiResponse(201, serviceType, Msg.SERVICE_TYPE_CREATED);
    } catch (error) {
      console.log(`error while creating service type: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

//   async findAll() {
//     try {
//       const serviceTypes = await this.serviceTypeModel.find();
//       if (!) {
        
//       }

//       return new ApiResponse(200, serviceTypes, Msg.SERVICE_TYPES_FETCHED);
//     } catch (error) {
//       console.log(`error while fetching service types: ${error}`);
//       return new ApiResponse(500, {}, Msg.SERVER_ERROR);
//     }
//   }
}
