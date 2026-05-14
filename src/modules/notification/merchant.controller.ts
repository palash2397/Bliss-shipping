import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('/test')
  async sendTestNotification(
    @Body()
    body: {
      token: string;
    },
  ) {
    return this.notificationService.sendPushNotification(
      body.token,
      'Test Notification',
      'Firebase notification is working successfully 🚀',
      {
        type: 'TEST_NOTIFICATION',
      },
    );
  }
}
