import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


export type VehicleDocument = Vehicle & Document;

@Schema({ timestamps: true })
export class Vehicle {

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  driverId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  })
  vehicleId: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;
}

export const VehicleSchema =
  SchemaFactory.createForClass(Vehicle);