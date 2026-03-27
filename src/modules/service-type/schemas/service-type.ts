import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceTypeDocument = ServiceType & Document;

@Schema({ timestamps: true })
export class ServiceType {
  @Prop({ required: true })
  name: string; // Instant, 4 Hour

  @Prop({ required: true, unique: true })
  code: string; // INSTANT, FOUR_HOUR
 
  @Prop({ required: true })
  description: string; 


  @Prop({ required: true })
  eta: string; // 30-60 min

  @Prop({ required: true })
  basePrice: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const ServiceTypeSchema = SchemaFactory.createForClass(ServiceType);
