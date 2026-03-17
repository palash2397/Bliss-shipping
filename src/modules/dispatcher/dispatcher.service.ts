import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { AssignDriverDto } from './dto/assign-driver.dto';
import { DELIVERY_STATUS } from '../../common/enums/delivery-status.enum';

import { ApiResponse } from 'src/utils/helpers/ApiResponse';
import { Msg } from 'src/utils/helpers/responseMsg';

@Injectable()
export class DispatcherService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async allOrders() {
    try {
      const data = await this.orderModel
        .find({
          dispatchStatus: DELIVERY_STATUS.CREATED,
          isDeleted: false,
        })
        .populate('merchantId', 'contactName')
        .populate('statusHistory.updatedBy', 'name')
        .sort({ createdAt: -1 })
        .lean();
      if (!data || data.length === 0) {
        return new ApiResponse(404, {}, Msg.ORDER_NOT_FOUND);
      }

      return new ApiResponse(200, data, Msg.ORDERS_FETCHED);
    } catch (error) {
      console.log(`Error in allOrders by dispatcher: `, error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async allDrivers(){
    try {
        
    } catch (error) {
      console.log(`Error in allDrivers by dispatcher: `, error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
}
