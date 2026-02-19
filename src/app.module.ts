import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { MerchantOrdersModule } from './modules/merchant-orders/merchant-orders.module';
import { MerchantModule } from './modules/merchant/merchant.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UserModule,
    MerchantOrdersModule,
    MerchantModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
