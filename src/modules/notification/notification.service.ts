import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Notification,
  NotificationDocument,
} from './schema/notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('FIREBASE_ADMIN')
    private readonly firebaseAdmin: typeof admin,

    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async sendPushNotification(
    userId: string,
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    try {
      const savedNotification = await this.notificationModel.create({
        userId,
        title,
        body,
        data,
      });

      const message: admin.messaging.Message = {
        token,
        notification: {
          title,
          body,
        },
        data,
      };

      const response = await this.firebaseAdmin.messaging().send(message);

      return {
        success: true,
        response,
        notification: savedNotification,
      };
    } catch (error) {
      console.log('Firebase notification error:', error);

      return {
        success: false,
        error: error.message,
      };
    }
  }
}
