import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Msg } from '../../utils/helpers/responseMsg';
import { ApiResponse } from '../../utils/helpers/ApiResponse';

import { User, UserDocument } from '../user/schemas/user.schema';
import { Merchant, MerchantDocument } from './schemas/merchant-profile.schema';
import { Order, OrderDocument } from '../orders/schemas/order.schema';

import { CreateMerchantDto } from './dto/create-profile.dto';
import { UpdateMerchantDto } from './dto/update-profile.dto';

import { DELIVERY_STATUS } from 'src/common/enums/delivery-status.enum';

@Injectable()
export class MerchantService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Merchant.name) private merchantModel: Model<MerchantDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async createProfile(userId: string, dto: CreateMerchantDto) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        return new ApiResponse(404, {}, Msg.USER_NOT_FOUND);
      }

      const merchant = await this.merchantModel.findOne({
        userId: new Types.ObjectId(userId),
      });
      if (merchant) {
        return new ApiResponse(400, {}, Msg.MERCHANT_ALREADY_EXISTS);
      }

      const obj = {
        ...dto,
        userId: new Types.ObjectId(userId),
      };

      const newMerchant = await this.merchantModel.create(obj);
      return new ApiResponse(201, newMerchant, Msg.MERCHANT_CREATED);
    } catch (error) {
      console.log(`error creating merchant profile: ${error.message}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async profile(id: string) {
    try {
      console.log('Merchant ID:', id);
      const merchant = await this.merchantModel
        .findOne({ userId: new Types.ObjectId(id) })
        .populate('userId', 'name email phone');

      console.log('Merchant:', merchant);
      if (!merchant) {
        return new ApiResponse(
          200,
          { isMerchant: false },
          Msg.MERCHANT_NOT_FOUND,
        );
      }
      return new ApiResponse(
        200,
        { isMerchant: true, merchant },
        Msg.MERCHANT_PROFILE_FETCHED,
      );
    } catch (error) {
      console.log(`error getting merchant profile: ${error.message}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async update(dto: UpdateMerchantDto, userId: string) {
    try {
      const merchant = await this.merchantModel.findOne({
        userId: new Types.ObjectId(userId),
      });

      if (!merchant) {
        return new ApiResponse(404, {}, Msg.MERCHANT_NOT_FOUND);
      }

      const updateMerchant = await this.merchantModel.findByIdAndUpdate(
        merchant._id,
        dto,
        { new: true },
      );

      return new ApiResponse(200, updateMerchant, Msg.MERCHANT_UPDATED);
    } catch (error) {
      console.log(`error updating merchant profile: ${error.message}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async orderStats(userId: string) {
    try {
      const merchant = await this.merchantModel.findOne({
        userId: new Types.ObjectId(userId),
      });

      if (!merchant) {
        return new ApiResponse(404, {}, Msg.MERCHANT_NOT_FOUND);
      }

      const merchantId = merchant._id;



      const stats = await this.orderModel.aggregate([
        {
          $match: {
            merchantId,
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: '$dispatchStatus',
            count: { $sum: 1 },
          },
        },
      ]);

      // default structure
      const result = {
        total: 0,
        created: 0,
        assigned: 0,
        decline: 0,
        rejected: 0,
        accepted: 0,
        outForDelivery: 0,
        delivered: 0,
        cancelled: 0,
        failed: 0,
      };

      stats.forEach((item) => {
        const status = item._id;
        const count = item.count;

        result.total += count;

        switch (status) {
          case DELIVERY_STATUS.CREATED:
            result.created = count;
            break;

          case DELIVERY_STATUS.ASSIGNED:
            result.assigned = count;
            break;

          case DELIVERY_STATUS.ACCEPTED:
            result.accepted = count;
            break;

          case DELIVERY_STATUS.DECLINED:
            result.decline = count;
            break;

          case DELIVERY_STATUS.REJECTED:
            result.rejected = count;
            break;

          case DELIVERY_STATUS.OUT_FOR_DELIVERY:
            result.outForDelivery = count;
            break;

          case DELIVERY_STATUS.DELIVERED:
            result.delivered = count;
            break;
          case DELIVERY_STATUS.CANCELLED:
            result.cancelled = count;
            break;

          case DELIVERY_STATUS.FAILED:
            result.failed = count;
            break;
        }
      });

      // const all = await this.orderModel.find({
      //   merchantId,
      //   isDeleted: false,
      // }).lean();

      return new ApiResponse(200, { result }, Msg.ORDER_STATS_FETCHED);
    } catch (error) {
      console.log(`error getting merchant order stats: ${error.message}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
}
