import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { MerchantModule } from './modules/merchant/merchant.module';
import { OrdersModule } from './modules/orders/orders.module';


import { AppController } from './app.controller';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UserModule,
    MerchantModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
