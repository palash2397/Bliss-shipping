import { Module, Global } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { FirebaseProvider } from './firebase/firebase.config';

@Global()
@Module({
  providers: [NotificationService, FirebaseProvider],
  exports: [NotificationService, FirebaseProvider],
})
export class NotificationModule {}
