import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ImportHistoryDocument = ImportHistory & Document;

@Schema({ timestamps: true })
export class ImportHistory {

  @Prop({
    type: Types.ObjectId,
    ref: 'Merchant',
    required: true,
    index: true,
  })
  merchantId: Types.ObjectId;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  totalRows: number;

  @Prop({ required: true })
  successRows: number;

  @Prop({ required: true })
  failedRows: number;

  @Prop({
    enum: ['SUCCESS', 'PARTIAL', 'FAILED'],
    default: 'SUCCESS',
  })
  status: string;
}

export const ImportHistorySchema =
  SchemaFactory.createForClass(ImportHistory);