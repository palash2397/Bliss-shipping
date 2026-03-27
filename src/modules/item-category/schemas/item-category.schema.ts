import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ItemCategory {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: false, default: true })
  isActive: boolean;
}

export type ItemCategoryDocument = ItemCategory & Document;
export const ItemCategorySchema = SchemaFactory.createForClass(ItemCategory);