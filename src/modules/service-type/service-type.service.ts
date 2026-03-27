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
}
