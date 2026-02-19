import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import {
  Merchant,
  MerchantSchema,
} from '../merchant/schemas/merchant-profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Merchant.name, schema: MerchantSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [
    UserService,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Merchant.name, schema: MerchantSchema },
    ]),
  ],
})
export class UserModule {}
