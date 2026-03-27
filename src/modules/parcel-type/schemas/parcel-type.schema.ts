import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ParcelTypeDocument = ParcelType & Document;

@Schema({ timestamps: true })
export class ParcelType {
  @Prop({ required: true })
  name: string; // Small, Medium

  @Prop({ required: true })
  minWeight: number;

  @Prop({ required: true })
  maxWeight: number;

  @Prop({ required: true })
  priceMultiplier: number; // 1x, 1.5x, 2x

  @Prop()
  description: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const ParcelTypeSchema = SchemaFactory.createForClass(ParcelType);
