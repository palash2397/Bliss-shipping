import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

import { Order, OrderSchema } from './schemas/order.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import {
  Merchant,
  MerchantSchema,
} from '../merchant/schemas/merchant-profile.schema';
import {
  ImportHistory,
  ImportHistorySchema,
} from './schemas/import-history.schema';
import { Vehicle, VehicleSchema } from '../vehicle/schemas/vehicle.schema';
import {
  ParcelType,
  ParcelTypeSchema,
} from '../parcel-type/schemas/parcel-type.schema';
import {
  ItemCategory,
  ItemCategorySchema,
} from '../item-category/schemas/item-category.schema';
import {
  ServiceType,
  ServiceTypeSchema,
} from '../service-type/schemas/service-type';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Merchant.name, schema: MerchantSchema },
    ]),
    MongooseModule.forFeature([
      { name: ImportHistory.name, schema: ImportHistorySchema },
    ]),
    MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]),
    MongooseModule.forFeature([
      { name: ParcelType.name, schema: ParcelTypeSchema },
    ]),
    MongooseModule.forFeature([
      { name: ItemCategory.name, schema: ItemCategorySchema },
    ]),
    MongooseModule.forFeature([
      { name: ServiceType.name, schema: ServiceTypeSchema },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
