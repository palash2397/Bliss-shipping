import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Msg } from '../../utils/helpers/responseMsg';
import { ApiResponse } from '../../utils/helpers/ApiResponse';

import { User, UserDocument } from '../user/schemas/user.schema';
import { Merchant, MerchantDocument } from './schemas/merchant-profile.schema';

import { CreateMerchantDto } from './dto/create-profile.dto';

@Injectable()
export class MerchantService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Merchant.name) private merchantModel: Model<MerchantDocument>,
  ) {}


  async createProfile(dto: CreateMerchantDto) {
    try {
      const user = await this.userModel.findById(dto.merchantId);
      if (!user) {
        return new ApiResponse(404, {}, Msg.USER_NOT_FOUND);
      }

      const merchant  = await this.merchantModel.findOne({ merchantId: dto.merchantId });
      if (merchant) {
        return new ApiResponse(400, {}, Msg.MERCHANT_ALREADY_EXISTS);
      }

      const newMerchant = await this.merchantModel.create(dto);
      return new ApiResponse(201, newMerchant, Msg.MERCHANT_CREATED);

    } catch (error) {
        console.log(`error creating merchant profile: ${error.message}`);
        return new ApiResponse(500, {}, Msg.SERVER_ERROR);
        
    }
  }

}
