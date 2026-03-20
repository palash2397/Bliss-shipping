import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Rating, RatingSchema } from './schemas/feedback.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Order, OrderSchema } from '../orders/schemas/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Rating.name, schema: RatingSchema },
      { name: User.name, schema: UserSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService],
  exports: [
    FeedbackService,
    MongooseModule.forFeature([{ name: Rating.name, schema: RatingSchema }]),
  ],
})
export class FeedbackModule {}
