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

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Rating.name) private ratingModel: Model<RatingDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async createRating(orderId: string, userId: string, dto: CreateRatingDto) {
    try {
      // 1️⃣ Check order exists
      const order = await this.orderModel.findById(orderId);

      if (!order) {
         return new ApiResponse(404, {}, Msg.ORDER_NOT_FOUND);
      }

      if (order?.dispatchStatus !== DELIVERY_STATUS.DELIVERED) {
        //  return new ApiResponse(400, {}, Msg.ORDER_NOT_DELIVERED);
      }

     
      const existingRating = await this.ratingModel.findOne({ orderId });

      if (existingRating) {
      }

      // 5️⃣ Create rating
      const rating = await this.ratingModel.create({
        orderId,
        driverId: dto.driverId,
        userId,                                                         
        rating: dto.rating,
        feedback: dto.feedback,
      });

      return {
        message: 'Rating submitted successfully',
        data: rating,
      };
    } catch (error) {
      console.log(`error while submiting review`, error);
      return new ApiResponse(500,{}, Msg.SERVER_ERROR);
    }
  }
}
