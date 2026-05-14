import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('FIREBASE_ADMIN')
    private readonly firebaseAdmin: typeof admin,
  ) {}

  async sendPushNotification(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    try {
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
