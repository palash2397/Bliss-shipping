import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Msg } from '../../utils/helpers/responseMsg';
import { ApiResponse } from '../../utils/helpers/ApiResponse';

import { DELIVERY_STATUS } from 'src/common/enums/delivery-status.enum';

import { User, UserDocument } from '../user/schemas/user.schema';
import { Order, OrderDocument } from '../orders/schemas/order.schema';

import { FailDeliveryDto } from './dto/fail-delivery.dto';

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
        .populate('merchantId', 'name')
        .populate('assignedDriverId', 'name')
        .populate('statusHistory.updatedBy', 'name')
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
      //   console.log('orderId', orderId);
      //   console.log('driverId', driverId);
      const order = await this.orderModel.findOne({
        _id: new Types.ObjectId(orderId),
        assignedDriverId: new Types.ObjectId(driverId),
        isDeleted: false,
      });

      //   console.log('order', order);

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

      return new ApiResponse(200, {order}, Msg.ORDER_ACCEPTED);
    } catch (error) {
      console.log(`error while accepting order:`, error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async declineOrder(orderId: string, driverId: string) {
    try {
      const order = await this.orderModel.findOne({
        _id: new Types.ObjectId(orderId),
        assignedDriverId: new Types.ObjectId(driverId),
        isDeleted: false,
      });

      if (!order) {
        return new ApiResponse(404, {}, Msg.ORDER_NOT_FOUND);
      }

      if (order.dispatchStatus !== DELIVERY_STATUS.ASSIGNED) {
        return new ApiResponse(400, {}, Msg.ORDER_CANNOT_BE_DECLINED);
      }

      const now = new Date();

      // Unassign driver
      order.assignedDriverId = null;

      // Move back to pool
      order.dispatchStatus = DELIVERY_STATUS.CREATED;
      order.dispatchStatusDate = now;

      order.statusHistory.push({
        status: DELIVERY_STATUS.DECLINED,
        time: now,
        updatedBy: driverId,
      });

      await order.save();
      return new ApiResponse(200, {order}, Msg.ORDER_DECLINED);
    } catch (error) {
      console.log(`error while declining order:`, error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async markArrived(orderId: string, driverId: string) {
    try {
      const order = await this.orderModel.findOne({
        _id: new Types.ObjectId(orderId),
        assignedDriverId: new Types.ObjectId(driverId),
        isDeleted: false,
      });

      if (!order) {
        return new ApiResponse(404, {}, Msg.ORDER_NOT_FOUND);
      }

      if (order.dispatchStatus !== DELIVERY_STATUS.ACCEPTED) {
        return new ApiResponse(
          400,
          {},
          Msg.ORDER_CAN_ONLY_BE_MARKED_AS_ARRIVED_AFTER_ACCEPTING,
        );
      }

      const now = new Date();

      // prevent duplicate ARRIVED
      const alreadyArrived = order.statusHistory.find(
        (s) => s.status === DELIVERY_STATUS.ARRIVED,
      );

      if (alreadyArrived) {
        return new ApiResponse(400, {}, Msg.ORDER_ALREADY_MARKED_AS_ARRIVED);
      }

      order.statusHistory.push({
        status: DELIVERY_STATUS.ARRIVED,
        time: now,
        updatedBy: driverId,
      });

      await order.save();

      return new ApiResponse(200, {order}, Msg.ARRIVAL_CONFIRMED);
    } catch (error) {
      console.log(`error while marking arrived:`, error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async startDelivery(orderId: string, driverId: string) {
    try {
      const order = await this.orderModel.findOne({
        _id: new Types.ObjectId(orderId),
        assignedDriverId: new Types.ObjectId(driverId),
        isDeleted: false,
      });

      if (!order) {
        return new ApiResponse(404, {}, Msg.ORDER_NOT_FOUND);
      }

      // must be accepted
      if (order.dispatchStatus !== 'ACCEPTED') {
        return new ApiResponse(
          400,
          {},
          Msg.ORDER_MUST_BE_ACCEPTED_BEFORE_STARTING_DELIVERY,
        );
      }

      // must be arrived first
      const hasArrived = order.statusHistory.some(
        (s) => s.status === DELIVERY_STATUS.ARRIVED,
      );

      if (!hasArrived) {
        return new ApiResponse(
          400,
          {},
          Msg.ORDER_CAN_ONLY_BE_MARKED_AS_ARRIVED_AFTER_ACCEPTING,
        );
      }

      const now = new Date();

      order.dispatchStatus = DELIVERY_STATUS.OUT_FOR_DELIVERY;
      order.dispatchStatusDate = now;

      order.statusHistory.push({
        status: DELIVERY_STATUS.OUT_FOR_DELIVERY,
        time: now,
        updatedBy: driverId,
      });

      await order.save();

      return new ApiResponse(200, {order}, Msg.DELIVERY_STARTED_SUCCESSFULLY);
    } catch (error) {
      console.log(`error while starting delivery:`, error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async completeDelivery(
    orderId: string,
    driverId: string,
    file: Express.Multer.File,
  ) {
    try {
      const order = await this.orderModel.findOne({
        _id: new Types.ObjectId(orderId),
        assignedDriverId: new Types.ObjectId(driverId),
        isDeleted: false,
      });

      console.log('file', file);

      if (!order) {
        return new ApiResponse(404, {}, Msg.ORDER_NOT_FOUND);
      }

      // must be in delivery
      if (order.dispatchStatus !== DELIVERY_STATUS.OUT_FOR_DELIVERY) {
        return new ApiResponse(400, {}, Msg.ORDER_IS_NOT_IN_DELIVERY_STATE);
      }

      // // POD validation
      // if (order.podImage) {
      //   return new ApiResponse(400, {}, 'Proof of Delivery (POD) is required');
      // }

      if (!file) {
        return new ApiResponse(400, {}, Msg.PROOF_OF_DELIVERY_REQUIRED);
      }

      const now = new Date();

      order.dispatchStatus = DELIVERY_STATUS.DELIVERED;
      order.dispatchStatusDate = now;

      // store POD
      order.podImage = file ? file.filename : null;

      order.statusHistory.push({
        status: DELIVERY_STATUS.DELIVERED,
        time: now,
        updatedBy: driverId,
      });

      await order.save();

      return new ApiResponse(200, {order}, Msg.ORDER_DELIVERED_SUCCESSFULLY);
    } catch (error) {
      console.log(`error while completing delivery:`, error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async failDelivery(
    driverId: string,
    dto: FailDeliveryDto,
    file: Express.Multer.File,
  ) {
    try {
      const order = await this.orderModel.findOne({
        _id: new Types.ObjectId(dto.orderId),
        assignedDriverId: new Types.ObjectId(driverId),
        isDeleted: false,
      });

      if (!order) {
        return new ApiResponse(404, {}, Msg.ORDER_NOT_FOUND);
      }

      if (!file) {
        return new ApiResponse(400, {}, Msg.PROOF_OF_DELIVERY_REQUIRED);
      }

      // must be in delivery
      if (order.dispatchStatus !== DELIVERY_STATUS.OUT_FOR_DELIVERY) {
        return new ApiResponse(400, {}, Msg.ORDER_IS_NOT_IN_DELIVERY_STATE);
      }

      const now = new Date();

      order.dispatchStatus = DELIVERY_STATUS.FAILED;
      order.dispatchStatusDate = now;

      
      order.failedReason = dto.reason;
      order.podImage = file ? file.filename : null;

      order.statusHistory.push({
        status: DELIVERY_STATUS.FAILED,
        time: now,
        updatedBy: driverId,
      });

      await order.save();

      return new ApiResponse(200, {order}, Msg.ORDER_FAILED_SUCCESSFULLY);
    } catch (error) {
      console.log(`error while failing delivery:`, error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
}
