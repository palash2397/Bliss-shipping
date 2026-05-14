import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationService } from './notification.service';
import { FirebaseProvider } from './firebase/firebase.config';
import { NotificationController } from './notification.controller';

import { Notification, NotificationSchema } from './schema/notification.schema';
import { User, UserSchema } from '../user/schemas/user.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
      { name: User.name, schema: UserSchema },
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
