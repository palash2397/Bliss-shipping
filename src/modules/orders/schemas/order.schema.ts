import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { DELIVERY_STATUS } from 'src/common/enums/delivery-status.enum';
import { STATUS } from 'src/common/enums/status.enum';
import { Role } from 'src/common/enums/role.enum';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true, versionKey: false })
export class Order {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId: Types.ObjectId;

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
    index: true,
    default: null,
  })
  externalOrderId: string;

  @Prop({
    enum: STATUS,
    default: STATUS.PENDING,
    index: true,
  })
  paymentStatus: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    default: null,
    index: true,
  })
  assignedDriverId: Types.ObjectId | null;

  @Prop({ default: null })
  dispatchStatusDate: Date;

  @Prop({
    type: [
      {
        status: { type: String },
        time: { type: Date },
        updatedBy: { type: Types.ObjectId, ref: 'User' },
      },
    ],
    default: [],
  })
  statusHistory: {
    status: string;
    time: Date;
    updatedBy: string;
  }[];

  @Prop({ type: String, default: null })
  podImage: string | null;

  @Prop({ default: null })
  failedReason: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: 'ServiceType',
    default: null,
  })
  serviceTypeId: Types.ObjectId | null;

  @Prop({
    type: Types.ObjectId,
    ref: 'ParcelType',
    default: null,
  })
  parcelTypeId: Types.ObjectId | null;

  @Prop({
    type: Types.ObjectId,
    ref: 'ItemCategory',
    default: null,
  })
  itemCategoryId: Types.ObjectId | null;

  @Prop({
    type: Types.ObjectId,
    ref: 'Vehicle',
    default: null,
  })
  vehicleId: Types.ObjectId | null;

  @Prop({ default: null })
  note: string;

  @Prop({ default: 0 })
  basePrice: number;

  @Prop({ default: 0 })
  totalPrice: number;

  @Prop({
    enum: Object.values(Role),
    default: Role.MERCHANT,
    index: true,
  })
  orderSource: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ userId: 1, dispatchStatus: 1 });
OrderSchema.index({ assignedDriverId: 1, dispatchStatus: 1 });
