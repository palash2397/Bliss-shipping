import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';

import { Msg } from '../../utils/helpers/responseMsg';
import { ApiResponse } from '../../utils/helpers/ApiResponse';

import { DELIVERY_STATUS } from 'src/common/enums/delivery-status.enum';

import { User, UserDocument } from '../user/schemas/user.schema';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class DriverService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) {}

  async getDriverTasks(driverId: string, tab: string) {
    try {
      if (!driverId) {
        return new ApiResponse(404, {}, Msg.DRIVER_NOT_FOUND);
      }

      const baseFilter: any = {
        assignedDriverId: new Types.ObjectId(driverId),
        isDeleted: false,
      };

      let statusFilter: any;

      switch (tab) {
        case 'new':
          statusFilter = DELIVERY_STATUS.ASSIGNED;
          break;

        case 'pickup':
          statusFilter = DELIVERY_STATUS.ACCEPTED;
          break;

        case 'delivering':
          statusFilter = DELIVERY_STATUS.OUT_FOR_DELIVERY;
          break;

        case 'completed':
          statusFilter = {
            $in: [DELIVERY_STATUS.DELIVERED, DELIVERY_STATUS.FAILED],
          };
          break;

        default:
          return new ApiResponse(400, {}, Msg.INVALID_TAB);
      }

      const orders = await this.orderModel
        .find({
          ...baseFilter,
          dispatchStatus: statusFilter,
        })
        .sort({ dispatchStatusDate: -1 })
        .populate('merchantId', 'firstName lastName phone')
        .lean();

      if (!orders || orders.length === 0) {
        return new ApiResponse(200, {}, Msg.ORDER_NOT_FOUND);
      }

      return new ApiResponse(200, orders, Msg.ORDERS_FETCHED);
    } catch (error) {
      console.log(`error while getting driver tasks:`, error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async acceptOrder(orderId: string, driverId: string) {
    try {
      const order = await this.orderModel.findOne({
        _id: orderId,
        assignedDriverId: driverId,
        isDeleted: false,
      });

      if (!order) {
        return new ApiResponse(404, {}, Msg.ORDER_NOT_FOUND);
      }

      if (order.dispatchStatus !== DELIVERY_STATUS.ASSIGNED) {
        return new ApiResponse(400, {}, Msg.ORDER_CANNOT_BE_ACCEPTED);
      }

      const now = new Date();

      order.dispatchStatus = DELIVERY_STATUS.ACCEPTED;
      order.dispatchStatusDate = now;

      order.statusHistory.push({
        status: DELIVERY_STATUS.ACCEPTED,
        time: now,
        updatedBy: driverId,
      });

      await order.save();

      return new ApiResponse(200, {}, Msg.ORDER_ACCEPTED);
    } catch (error) {
      console.log(`error while accepting order:`, error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
}
