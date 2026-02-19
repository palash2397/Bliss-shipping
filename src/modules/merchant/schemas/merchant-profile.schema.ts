import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MerchantDocument = Merchant & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Merchant {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  })
  userId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  companyName: string;

  @Prop({ required: true, trim: true })
  contactName: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ required: true, trim: true })
  address: string;

  @Prop({ required: true, trim: true })
  city: string;

  @Prop({ required: true, trim: true })
  province: string;

  @Prop({ required: true, trim: true })
  postalCode: string;

  @Prop({ default: true, index: true })
  isActive: boolean;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const MerchantSchema =
  SchemaFactory.createForClass(Merchant);

MerchantSchema.index({ companyName: 1 });
MerchantSchema.index({ isDeleted: 1 });
