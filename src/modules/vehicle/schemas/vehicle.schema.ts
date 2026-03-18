import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


export type VehicleDocument = Vehicle & Document;

@Schema({ timestamps: true })
export class Vehicle {


  @Prop({ required: true })
  name: string; // Car, SUV, Truck

  @Prop()
  description: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const VehicleSchema =
  SchemaFactory.createForClass(Vehicle);