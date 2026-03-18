import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


export type DriverVehicleDocument = DriverVehicle & Document;

@Schema({ timestamps: true })
export class DriverVehicle {
  
}