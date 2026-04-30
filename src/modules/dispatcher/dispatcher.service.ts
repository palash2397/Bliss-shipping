import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { User, UserDocument } from '../user/schemas/user.schema';
import { DELIVERY_STATUS } from '../../common/enums/delivery-status.enum';
import { Role } from 'src/common/enums/role.enum';

import { ApiResponse } from 'src/utils/helpers/ApiResponse';
import { Msg } from 'src/utils/helpers/responseMsg';

import { AssignDriverDto } from './dto/assign-driver.dto';
@Injectable()
export class DispatcherService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async allOrders() {
    try {
      const data = await this.orderModel
        .find({
          dispatchStatus: DELIVERY_STATUS.CREATED,
          isDeleted: false,
        })
        .populate('userId', 'name email')
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

  async allDrivers() {
    try {
      const data = await this.userModel
        .find({ role: Role.DRIVER, isActive: true })
        .lean();

      if (!data || data.length === 0) {
        return new ApiResponse(404, {}, Msg.DRIVER_NOT_FOUND);
      }

      data.map((driver) => {
        driver.profilePic = driver.profilePic
          ? `${process.env.BASE_URL}/uploads/profile/${driver.profilePic}`
          : null;
      });

      // user.array.forEach(element => {

      // });

      return new ApiResponse(200, data, Msg.DRIVERS_FETCHED);
    } catch (error) {
      console.log(`Error in allDrivers by dispatcher: `, error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async assignDriver(dto: AssignDriverDto, userId: string) {
    try {
      const { driverId, orderIds } = dto;

      const driver = await this.userModel.findById(driverId);
      if (!driver) {
        return new ApiResponse(404, {}, Msg.DRIVER_NOT_FOUND);
      }

      const now = new Date();

      const orders = await this.orderModel.find({
        _id: { $in: orderIds },
        dispatchStatus: DELIVERY_STATUS.CREATED,
      });

      console.log('orders', orders);

      if (!orders || orders.length === 0) {
        return new ApiResponse(404, {}, Msg.ORDER_NOT_FOUND);
      }

      const assign = await this.orderModel.updateMany(
        {
          _id: { $in: orderIds },
          dispatchStatus: DELIVERY_STATUS.CREATED,
        },
        {
          assignedDriverId: new Types.ObjectId(driverId),
          dispatchStatus: DELIVERY_STATUS.ASSIGNED,
          dispatchStatusDate: now,
          $push: {
            statusHistory: {
              status: DELIVERY_STATUS.ASSIGNED,
              time: now,
              updatedBy: new Types.ObjectId(userId),
            },
          },
        },
      );

      return new ApiResponse(200, { assign }, Msg.DRIVER_ASSIGNED_SUCCESSFULLY);
    } catch (error) {
      console.log(`Error in assignDriver by dispatcher: `, error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async assignedOrders(userId: string) {
    try {
      const orders = await this.orderModel
        .find({
          assignedDriverId: new Types.ObjectId(userId),
          dispatchStatus: DELIVERY_STATUS.ASSIGNED,
        })
        .lean();

      if (!orders || orders.length === 0) {
        return new ApiResponse(404, {}, Msg.ASSIGNED_ORDERS_NOT_FOUND);
      }

      return new ApiResponse(200, orders, Msg.ASSIGNED_ORDERS_FETCHED);
    } catch (error) {
      console.log(`Error in assignedOrders by dispatcher: `, error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  // async assign
}
