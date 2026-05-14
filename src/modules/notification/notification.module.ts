import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationService } from './notification.service';
import { FirebaseProvider } from './firebase/firebase.config';
import { NotificationController } from './merchant.controller';

import { Notification, NotificationSchema } from './schema/notification.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  providers: [NotificationService, FirebaseProvider],
  controllers: [NotificationController],
  exports: [
    NotificationService,
    FirebaseProvider,
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
})
export class NotificationModule {}
