import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { NotificationService } from './notification.service';

import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
// import { RoleGuard } from '../auth/roles/roles.guard';
// import { Role } from 'src/common/enums/role.enum';
// import { Roles } from '../auth/roles/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('/test')
  async sendTestNotification(
    @Body()
    body: {
      userId: string;
      token: string;
    },
  ) {
    return this.notificationService.sendPushNotification(
      body.userId,
      body.token,
      'Test Notification',
      'Firebase notification is working 🚀',
      {
        type: 'TEST_NOTIFICATION',
      },
    );
  }

  @Get('/my/all')
  async myNotifications(@Req() req: any) {
    return this.notificationService.myNotifications(req.user.id);
  }

  @Patch('/mark-as-read/all')
  async markAsReadAll(@Req() req: any) {
    return this.notificationService.markAllNotificationAsRead(req.user.id);
  }

  @Patch('/mark-as-read/:id')
  async markAsRead(@Req() req: any, @Param('id') id: string) {
    return this.notificationService.markNotificationAsRead(id, req.user.id);
  }
}
