import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';


import { ApiResponse } from 'src/utils/helpers/ApiResponse';
import { Msg } from 'src/utils/helpers/responseMsg';

import { Rating, RatingDocument } from './schemas/feedback.schema';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FeedbackService {
    constructor(
        @InjectModel(Rating.name) private ratingModel: Model<RatingDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    ) {}
}
