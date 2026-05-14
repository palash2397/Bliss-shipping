import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from '../user/schemas/user.schema';

import {
  Notification,
  NotificationDocument,
} from './schema/notification.schema';

import { ApiResponse } from 'src/utils/helpers/ApiResponse';
import { Msg } from 'src/utils/helpers/responseMsg';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('FIREBASE_ADMIN')
    private readonly firebaseAdmin: typeof admin,

    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
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

  async myNotifications(userId: string) {
    try {
      const notifications = await this.notificationModel.find({
        userId,
      });

      if (!notifications || notifications.length === 0) {
        return new ApiResponse(404, {}, Msg.NOTIFICATIONS_NOT_FOUND);
      }

      return new ApiResponse(200, notifications, Msg.NOTIFICATIONS_FETCHED);
    } catch (error) {
      console.log(`error while getting notifications ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async markNotificationAsRead(notificationId: string, userId: string) {
    try {
      const notification = await this.notificationModel.findOneAndUpdate(
        {
          _id: notificationId,
          userId,
        },
        {
          isRead: true,
        },
        {
          new: true,
        },
      );

      if (!notification) {
        return new ApiResponse(404, {}, Msg.NOTIFICATION_NOT_FOUND);
      }

      return new ApiResponse(200, notification, Msg.NOTIFICATION_READ);
    } catch (error) {
      console.log(`error while marking notification as read ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async markAllNotificationAsRead(userId: string) {
    try {
      const notifications = await this.notificationModel.updateMany(
        { userId },
        {
          isRead: true,
        },
      );

      if (!notifications) {
        return new ApiResponse(404, {}, Msg.NOTIFICATIONS_NOT_FOUND);
      }

      return new ApiResponse(200, notifications, Msg.NOTIFICATION_READ);
    } catch (error) {
      console.log(`error while marking notification as read ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async deleteNotification(notificationId: string) {
    try {
      const notification =
        await this.notificationModel.findByIdAndDelete(notificationId);

      if (!notification) {
        return new ApiResponse(404, {}, Msg.NOTIFICATION_NOT_FOUND);
      }

      return new ApiResponse(200, notification, Msg.NOTIFICATION_DELETED);
    } catch (error) {
      console.log(`error while deleting notification ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async deleteAllNotification(userId: string) {
    try {
      const notifications = await this.notificationModel.deleteMany({
        userId,
      });

      if (!notifications) {
        return new ApiResponse(404, {}, Msg.NOTIFICATIONS_NOT_FOUND);
      }

      return new ApiResponse(200, notifications, Msg.NOTIFICATION_DELETED);
    } catch (error) {
      console.log(`error while deleting notification ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
}
