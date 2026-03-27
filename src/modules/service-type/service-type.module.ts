import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { ServiceTypeService } from './service-type.service';
import { ServiceTypeController } from './service-type.controller';

import { ServiceType, ServiceTypeSchema } from './schemas/service-type';
import { User, UserSchema } from '../user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ServiceType.name, schema: ServiceTypeSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ServiceTypeController],
  providers: [ServiceTypeService],

  exports: [
    ServiceTypeService,
    MongooseModule.forFeature([
      { name: ServiceType.name, schema: ServiceTypeSchema },
    ]),
  ],
})
export class ServiceTypeModule {}
