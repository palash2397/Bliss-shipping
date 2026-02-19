import { Module } from '@nestjs/common';
import { MerchantOrdersService } from './merchant-orders.service';
import { MerchantOrdersController } from './merchant-orders.controller';

@Module({
  controllers: [MerchantOrdersController],
  providers: [MerchantOrdersService],
})
export class MerchantOrdersModule {}
