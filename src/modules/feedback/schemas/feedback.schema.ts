import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RatingDocument = Rating & Document;

@Schema({ timestamps: true })
export class Rating {
  @Prop({
    type: Types.ObjectId,
    ref: 'Order',
    required: true,
    index: true,
  })
  orderId: string;

  @Prop({ required: true })
  driverId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop()
  feedback: string;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);

// 🔥 IMPORTANT: Prevent duplicate rating per order
RatingSchema.index({ orderId: 1 }, { unique: true });
