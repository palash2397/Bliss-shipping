import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ItemCategoryDocument = ItemCategory & Document;

@Schema({ timestamps: true })
export class ItemCategory {
  @Prop({ required: true })
  name: string; // Electronics, Food, Documents

  @Prop({ default: true })
  isActive: boolean;
}

export const ItemCategorySchema = SchemaFactory.createForClass(ItemCategory);
