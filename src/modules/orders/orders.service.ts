import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Msg } from '../../utils/helpers/responseMsg';
import { ApiResponse } from '../../utils/helpers/ApiResponse';

import { Order, OrderDocument } from './schemas/order.schema';
import { User, UserDocument } from '../user/schemas/user.schema';
import {
  Merchant,
  MerchantDocument,
} from '../merchant/schemas/merchant-profile.schema';

import { CreateOrderDto } from './dto/create-order';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Merchant.name)
    private readonly merchantModel: Model<MerchantDocument>,
  ) {}

  async createOrder(dto: CreateOrderDto, userId: string) {
    try {
      const merchant = await this.merchantModel.findOne({ userId: new Types.ObjectId(userId) });
      if (!merchant) {
        return new ApiResponse(404, {}, Msg.MERCHANT_NOT_FOUND);
      }
      const orderNumber = `BS-${Date.now()}`;

      const order = await this.orderModel.create({
        ...dto,
        merchantId: merchant._id,
        orderNumber,
        dispatchStatus: 'CREATED',
        paymentStatus: 'PENDING',
      });

      return new ApiResponse(201, order, Msg.ORDER_CREATED);
    } catch (error) {
      console.log(`error creating order: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
}
