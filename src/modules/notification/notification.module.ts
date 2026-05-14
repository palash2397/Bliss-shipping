import { Module, Global } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { FirebaseProvider } from './firebase/firebase.config';
import { NotificationController } from './merchant.controller';

@Global()
@Module({
  providers: [NotificationService, FirebaseProvider],
  exports: [NotificationService, FirebaseProvider],
  controllers: [NotificationController],
})
export class NotificationModule {}
