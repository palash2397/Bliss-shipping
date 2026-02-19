import { Module } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { MerchantController } from './merchant.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Merchant, MerchantSchema } from './schemas/merchant-profile.schema';
import { User, UserSchema } from '../user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Merchant.name, schema: MerchantSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [MerchantController],
  providers: [MerchantService],
  exports: [MerchantService, MongooseModule.forFeature([{ name: Merchant.name, schema: MerchantSchema }])],
})
export class MerchantModule {}
