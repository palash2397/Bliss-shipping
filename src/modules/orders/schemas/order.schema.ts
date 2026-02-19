import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DELIVERY_STATUS } from 'src/common/enums/delivery-status.enum';
import { STATUS } from 'src/common/enums/status.enum';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true, versionKey: false })
export class Order {
  @Prop({
    type: Types.ObjectId,
    ref: 'Merchant',
    required: true,
    index: true,
  })
  merchantId: Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  orderNumber: string; // internal system ID

  @Prop({ required: true })
  recipientName: string;

  @Prop({ required: true })
  recipientPhone: string;

  @Prop({ required: true })
  pickupAddress: string;

  @Prop({ required: true })
  pickupLat: string;

  @Prop({ required: true })
  pickupLng: string;

  @Prop({ required: true })
  dropAddress: string;

  @Prop({ required: true })
  dropLat: string;

  @Prop({ required: true })
  dropLng: string;

  @Prop({
    enum: DELIVERY_STATUS,
    default: DELIVERY_STATUS.CREATED,
    index: true,
  })
  dispatchStatus: string;

  @Prop({
    enum: STATUS,
    default: STATUS.PENDING,
    index: true,
  })
  paymentStatus: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Driver',
    default: null,
    index: true,
  })
  assignedDriverId: Types.ObjectId;

  @Prop({ default: null })
  deliveredAt: Date;

  @Prop({ default: null })
  failedReason: string;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ merchantId: 1, dispatchStatus: 1 });
OrderSchema.index({ assignedDriverId: 1, dispatchStatus: 1 });
