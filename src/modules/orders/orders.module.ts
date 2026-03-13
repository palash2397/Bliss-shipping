import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';


import { Order, OrderSchema } from './schemas/order.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Merchant, MerchantSchema } from '../merchant/schemas/merchant-profile.schema';
import { ImportHistory, ImportHistorySchema } from './schemas/import-history.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Merchant.name, schema: MerchantSchema }]),
    MongooseModule.forFeature([{ name: ImportHistory.name, schema: ImportHistorySchema }]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
