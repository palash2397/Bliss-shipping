import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';

import { ApiResponse } from 'src/utils/helpers/ApiResponse';
import { Msg } from 'src/utils/helpers/responseMsg';

import { Rating, RatingDocument } from './schemas/feedback.schema';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRatingDto } from './dto/create-feedback.dto';

import { DELIVERY_STATUS } from 'src/common/enums/delivery-status.enum';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Rating.name) private ratingModel: Model<RatingDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async createRating(userId: string, dto: CreateRatingDto) {
    try {
      // 1️⃣ Check order exists
      const order = await this.orderModel.findById(dto.orderId);

      if (!order) {
        return new ApiResponse(404, {}, Msg.ORDER_NOT_FOUND);
      }

      if (order?.dispatchStatus !== DELIVERY_STATUS.DELIVERED) {
        return new ApiResponse(400, {}, Msg.ORDER_NOT_DELIVERED);
      }

      const findDriver = await this.userModel.findById(dto.driverId);
      if (!findDriver || findDriver.role !== Role.DRIVER) {
        return new ApiResponse(404, {}, Msg.DRIVER_NOT_FOUND);
      }

      const driverId = new Types.ObjectId(dto.driverId);

      if (
        order.assignedDriverId &&
        order.assignedDriverId.toString() !== driverId.toString()
      ) {
        return new ApiResponse(400, {}, Msg.DRIVER_NOT_ASSIGNED_TO_ORDER);
      }

      const existingRating = await this.ratingModel.findOne({
        orderId: dto.orderId,
      });

      if (existingRating) {
        return new ApiResponse(400, {}, Msg.RATING_ALREADY_EXISTS_FOR_ORDER);
      }

      // 5️⃣ Create rating
      const rating = await this.ratingModel.create({
        orderId: dto.orderId,
        driverId: dto.driverId,
        userId,
        rating: dto.rating,
        feedback: dto.feedback,
      });

      return new ApiResponse(201, rating, Msg.RATING_CREATED);
    } catch (error) {
      console.log(`error while submiting review`, error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async ratingByOrder(orderId: string, userId: string) {
    try {
      const order = await this.orderModel
        .findById(orderId)

      if (!order) {
        return new ApiResponse(404, {}, Msg.ORDER_NOT_FOUND);
      }

      const rating = await this.ratingModel
        .findOne({ orderId, userId })
        .populate('driverId', 'name email')
        .populate('userId', 'name email')
        .populate('orderId', 'orderNumber recipientName recipientPhone')
        .select('-__v -updatedAt');
      if (!rating) {
        return new ApiResponse(404, {}, Msg.RATING_ALREADY_NOT_EXIST_FOR_ORDER);
      }

      return new ApiResponse(200, rating, Msg.RATING_FETCHED);
    } catch (error) {
      console.log(`error while fetching rating`, error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
}
