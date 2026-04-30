import { Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Msg } from '../../utils/helpers/responseMsg';
import { ApiResponse } from '../../utils/helpers/ApiResponse';

import { DELIVERY_STATUS } from 'src/common/enums/delivery-status.enum';
import { Role } from 'src/common/enums/role.enum';
import { generateOtp, getExpirationTime } from 'src/utils/helpers';

import { User, UserDocument } from '../user/schemas/user.schema';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { Vehicle, VehicleDocument } from '../vehicle/schemas/vehicle.schema';
import {
  DriverVehicle,
  DriverVehicleDocument,
} from '../vehicle/schemas/driver-vehicle.schema';

import { FailDeliveryDto } from './dto/fail-delivery.dto';
import { DriverRegisterDto } from './dto/driver-register.dto';
import { LoginUserDto } from 'src/modules/user/dto/login-user.dto';

@Injectable()
export class DriverService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Vehicle.name)
    private readonly vehicleModel: Model<VehicleDocument>,
    @InjectModel(DriverVehicle.name)
    private readonly driverVehicleModel: Model<DriverVehicleDocument>,
  ) {}

  async registerDriver(dto: DriverRegisterDto) {
    try {
      const { name, email, password, countryCode, phone } = dto;
      const user = await this.userModel.findOne({
        name,
        phone,
        countryCode,
      });

      if (user) {
        return new ApiResponse(400, {}, Msg.USER_EXISTS);
      }

      const otp = generateOtp();
      const otpExpiresAt = getExpirationTime();

      console.log('OTP:', otp);
      console.log('OTP Expiration:', otpExpiresAt);

      await this.userModel.create({
        name,
        email,
        password,
        countryCode,
        phone,
        otp,
        role: Role.DRIVER,
        otpExpiresAt,
      });

      return new ApiResponse(201, { otp: otp }, Msg.OTP_SENT);
    } catch (error) {
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async login(dto: LoginUserDto) {
    try {
      const { email, password } = dto;

      const user = await this.userModel
        .findOne({ email, role: Role.DRIVER })
        .select('+password');
      if (!user) {
        return new ApiResponse(404, {}, Msg.INVALID_CREDENTIALS);
      }

      console.log('user', user);

      if (!user.isActive) {
        return new ApiResponse(401, {}, Msg.USER_INACTIVE);
      }

      // if (user.role !== dto.role) {
      //   return new ApiResponse(401, {}, Msg.INVALID_CREDENTIALS);
      // }

      console.log('password', typeof password);
      console.log('user.password', typeof user.password);

      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('isPasswordValid', isPasswordValid);
      if (!isPasswordValid) {
        return new ApiResponse(401, {}, Msg.INVALID_CREDENTIALS);
      }

      if (!user.isActive) {
        return new ApiResponse(401, {}, Msg.USER_INACTIVE);
      }

      const vehicle = await this.driverVehicleModel.findOne({
        driverId: new Types.ObjectId(user._id),
      });
      console.log('vehicle', vehicle);

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        {
          expiresIn: '10d',
        },
      );

      const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVehicleAssigned: !!vehicle,
        token,
      };

      return new ApiResponse(200, userData, Msg.LOGIN_SUCCESS);
    } catch (error) {
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  // async verifyOtp(dto: VerifyOtpDto) {
  //   try {
  //     const user = await this.userModel.findOne({ email: dto.email });
  //     if (!user) {
  //       return new ApiResponse(404, {}, Msg.USER_NOT_FOUND);
  //     }

  //     if (!user.otp || !user.otpExpiresAt) {
  //       return new ApiResponse(400, {}, Msg.OTP_NOT_FOUND);
  //     }

  //     if (user.otp !== dto.otp || new Date() > user.otpExpiresAt) {
  //       return new ApiResponse(400, {}, Msg.OTP_INVALID);
  //     }

  //     user.otp = null;
  //     user.otpExpiresAt = null;
  //     user.isVerified = true;
  //     await user.save();

  //     return new ApiResponse(200, {}, Msg.OTP_VERIFIED);
  //   } catch (error) {
  //     console.log(`error while verifying otp: ${error}`);
  //     return new ApiResponse(500, {}, Msg.SERVER_ERROR);
  //   }
  // }

  // async resendOtp(email: string) {
  //   try {
  //     const user = await this.userModel.findOne({ email });
  //     if (!user) {
  //       return new ApiResponse(404, {}, Msg.USER_NOT_FOUND);
  //     }

  //     if (user.isVerified) {
  //       return new ApiResponse(400, {}, Msg.USER_ALREADY_VERIFIED);
  //     }

  //     const otp = generateOtp();
  //     const otpExpiresAt = getExpirationTime();

  //     user.otp = otp;
  //     user.otpExpiresAt = otpExpiresAt;
  //     await user.save();

  //     console.log('OTP:', otp);
  //     console.log('OTP Expiration:', otpExpiresAt);

  //     return new ApiResponse(200, { otp: otp }, Msg.OTP_RESENT);
  //   } catch (error) {
  //     console.log(`error while resending otp: ${error}`);
  //     return new ApiResponse(500, {}, Msg.SERVER_ERROR);
  //   }
  // }

  async getDriverTasks(driverId: string, tab: string) {
    try {
      if (!driverId) {
        return new ApiResponse(404, {}, Msg.DRIVER_NOT_FOUND);
      }

      const baseFilter: any = {
        assignedDriverId: new Types.ObjectId(driverId),
        isDeleted: false,
      };

      let statusFilter: any;

      switch (tab) {
        case 'new':
          statusFilter = DELIVERY_STATUS.ASSIGNED;
          break;

        case 'pickup':
          statusFilter = DELIVERY_STATUS.ACCEPTED;
          break;

        case 'delivering':
          statusFilter = DELIVERY_STATUS.OUT_FOR_DELIVERY;
          break;

        case 'completed':
          statusFilter = {
            $in: [DELIVERY_STATUS.DELIVERED, DELIVERY_STATUS.FAILED],
          };
          break;

        default:
          return new ApiResponse(400, {}, Msg.INVALID_TAB);
      }

      const orders = await this.orderModel
        .find({
          ...baseFilter,
          dispatchStatus: statusFilter,
        })
        .sort({ dispatchStatusDate: -1 })
        .populate('assignedDriverId', 'name phoneNumber')
        .populate('userId', 'name email')
        .populate('statusHistory.updatedBy', 'name phoneNumber')
        .lean();

      if (!orders || orders.length === 0) {
        return new ApiResponse(200, {}, Msg.ORDER_NOT_FOUND);
      }

      return new ApiResponse(200, orders, Msg.ORDERS_FETCHED);
    } catch (error) {
      console.log(`error while getting driver tasks:`, error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async acceptOrder(orderId: string, driverId: string) {
    try {
      //   console.log('orderId', orderId);
      //   console.log('driverId', driverId);
      const order = await this.orderModel.findOne({
        _id: new Types.ObjectId(orderId),
        assignedDriverId: new Types.ObjectId(driverId),
        isDeleted: false,
      });

      //   console.log('order', order);

      if (!order) {
        return new ApiResponse(404, {}, Msg.ORDER_NOT_FOUND);
      }

      if (order.dispatchStatus !== DELIVERY_STATUS.ASSIGNED) {
        return new ApiResponse(400, {}, Msg.ORDER_CANNOT_BE_ACCEPTED);
      }

      const now = new Date();

      order.dispatchStatus = DELIVERY_STATUS.ACCEPTED;
      order.dispatchStatusDate = now;

      order.statusHistory.push({
        status: DELIVERY_STATUS.ACCEPTED,
        time: now,
        updatedBy: driverId,
      });

      await order.save();

      return new ApiResponse(200, { order }, Msg.ORDER_ACCEPTED);
    } catch (error) {
      console.log(`error while accepting order:`, error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async declineOrder(orderId: string, driverId: string) {
    try {
      const order = await this.orderModel.findOne({
        _id: new Types.ObjectId(orderId),
        assignedDriverId: new Types.ObjectId(driverId),
        isDeleted: false,
      });

      if (!order) {
        return new ApiResponse(404, {}, Msg.ORDER_NOT_FOUND);
      }

      if (order.dispatchStatus !== DELIVERY_STATUS.ASSIGNED) {
        return new ApiResponse(400, {}, Msg.ORDER_CANNOT_BE_DECLINED);
      }

      const now = new Date();

      // Unassign driver
      order.assignedDriverId = null;

      // Move back to pool
      order.dispatchStatus = DELIVERY_STATUS.CREATED;
      order.dispatchStatusDate = now;

      order.statusHistory.push({
        status: DELIVERY_STATUS.DECLINED,
        time: now,
        updatedBy: driverId,
      });

      await order.save();
      return new ApiResponse(200, { order }, Msg.ORDER_DECLINED);
    } catch (error) {
      console.log(`error while declining order:`, error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async markArrived(orderId: string, driverId: string) {
    try {
      const order = await this.orderModel.findOne({
        _id: new Types.ObjectId(orderId),
        assignedDriverId: new Types.ObjectId(driverId),
        isDeleted: false,
      });

      if (!order) {
        return new ApiResponse(404, {}, Msg.ORDER_NOT_FOUND);
      }

      if (order.dispatchStatus !== DELIVERY_STATUS.ACCEPTED) {
        return new ApiResponse(
          400,
          {},
          Msg.ORDER_CAN_ONLY_BE_MARKED_AS_ARRIVED_AFTER_ACCEPTING,
        );
      }

      const now = new Date();

      // prevent duplicate ARRIVED
      const alreadyArrived = order.statusHistory.find(
        (s) => s.status === DELIVERY_STATUS.ARRIVED,
      );

      if (alreadyArrived) {
        return new ApiResponse(400, {}, Msg.ORDER_ALREADY_MARKED_AS_ARRIVED);
      }

      order.statusHistory.push({
        status: DELIVERY_STATUS.ARRIVED,
        time: now,
        updatedBy: driverId,
      });

      await order.save();

      return new ApiResponse(200, { order }, Msg.ARRIVAL_CONFIRMED);
    } catch (error) {
      console.log(`error while marking arrived:`, error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async startDelivery(orderId: string, driverId: string) {
    try {
      const order = await this.orderModel.findOne({
        _id: new Types.ObjectId(orderId),
        assignedDriverId: new Types.ObjectId(driverId),
        isDeleted: false,
      });

      if (!order) {
        return new ApiResponse(404, {}, Msg.ORDER_NOT_FOUND);
      }

      // must be accepted
      if (order.dispatchStatus !== 'ACCEPTED') {
        return new ApiResponse(
          400,
          {},
          Msg.ORDER_MUST_BE_ACCEPTED_BEFORE_STARTING_DELIVERY,
        );
      }

      // must be arrived first
      const hasArrived = order.statusHistory.some(
        (s) => s.status === DELIVERY_STATUS.ARRIVED,
      );

      if (!hasArrived) {
        return new ApiResponse(
          400,
          {},
          Msg.ORDER_CAN_ONLY_BE_MARKED_AS_ARRIVED_AFTER_ACCEPTING,
        );
      }

      const now = new Date();

      order.dispatchStatus = DELIVERY_STATUS.OUT_FOR_DELIVERY;
      order.dispatchStatusDate = now;

      order.statusHistory.push({
        status: DELIVERY_STATUS.OUT_FOR_DELIVERY,
        time: now,
        updatedBy: driverId,
      });

      await order.save();

      return new ApiResponse(200, { order }, Msg.DELIVERY_STARTED_SUCCESSFULLY);
    } catch (error) {
      console.log(`error while starting delivery:`, error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async completeDelivery(
    orderId: string,
    driverId: string,
    file: Express.Multer.File,
  ) {
    try {
      const order = await this.orderModel.findOne({
        _id: new Types.ObjectId(orderId),
        assignedDriverId: new Types.ObjectId(driverId),
        isDeleted: false,
      });

      console.log('file', file);

      if (!order) {
        return new ApiResponse(404, {}, Msg.ORDER_NOT_FOUND);
      }

      // must be in delivery
      if (order.dispatchStatus !== DELIVERY_STATUS.OUT_FOR_DELIVERY) {
        return new ApiResponse(400, {}, Msg.ORDER_IS_NOT_IN_DELIVERY_STATE);
      }

      // // POD validation
      // if (order.podImage) {
      //   return new ApiResponse(400, {}, 'Proof of Delivery (POD) is required');
      // }

      if (!file) {
        return new ApiResponse(400, {}, Msg.PROOF_OF_DELIVERY_REQUIRED);
      }

      const now = new Date();

      order.dispatchStatus = DELIVERY_STATUS.DELIVERED;
      order.dispatchStatusDate = now;

      // store POD
      order.podImage = file ? file.filename : null;

      order.statusHistory.push({
        status: DELIVERY_STATUS.DELIVERED,
        time: now,
        updatedBy: driverId,
      });

      await order.save();

      return new ApiResponse(200, { order }, Msg.ORDER_DELIVERED_SUCCESSFULLY);
    } catch (error) {
      console.log(`error while completing delivery:`, error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async failDelivery(
    driverId: string,
    dto: FailDeliveryDto,
    file: Express.Multer.File,
  ) {
    try {
      const order = await this.orderModel.findOne({
        _id: new Types.ObjectId(dto.orderId),
        assignedDriverId: new Types.ObjectId(driverId),
        isDeleted: false,
      });

      if (!order) {
        return new ApiResponse(404, {}, Msg.ORDER_NOT_FOUND);
      }

      if (!file) {
        return new ApiResponse(400, {}, Msg.PROOF_OF_DELIVERY_REQUIRED);
      }

      // must be in delivery
      if (order.dispatchStatus !== DELIVERY_STATUS.OUT_FOR_DELIVERY) {
        return new ApiResponse(400, {}, Msg.ORDER_IS_NOT_IN_DELIVERY_STATE);
      }

      const now = new Date();

      order.dispatchStatus = DELIVERY_STATUS.FAILED;
      order.dispatchStatusDate = now;

      order.failedReason = dto.reason;
      order.podImage = file ? file.filename : null;

      order.statusHistory.push({
        status: DELIVERY_STATUS.FAILED,
        time: now,
        updatedBy: driverId,
      });

      await order.save();

      return new ApiResponse(200, { order }, Msg.ORDER_FAILED_SUCCESSFULLY);
    } catch (error) {
      console.log(`error while failing delivery:`, error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async getOrderDetail(orderId: string, driverId: string) {
    try {
      let folderName: string;
      const order = await this.orderModel
        .findOne({
          _id: new Types.ObjectId(orderId),
          assignedDriverId: new Types.ObjectId(driverId),
          isDeleted: false,
        })
        .populate('assignedDriverId', 'name phoneNumber')
        .populate('userId', 'name email')
        .populate('statusHistory.updatedBy', 'name phoneNumber')
        .lean();

      if (!order) {
        return new ApiResponse(404, {}, Msg.ORDER_NOT_FOUND);
      }

      folderName =
        order.dispatchStatus === DELIVERY_STATUS.FAILED ? `failed` : `pod`;
      order.podImage = order.podImage
        ? `${process.env.BASE_URL}/uploads/${folderName}/${order.podImage}`
        : null;

      return new ApiResponse(200, order, Msg.ORDER_FETCHED);
    } catch (error) {
      console.log(`error while getting order detail:`, error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  // async getNextStop(driverId: string) {
  //   const order = await this.orderModel
  //     .findOne({
  //       assignedDriverId: driverId,
  //       isDeleted: false,
  //       dispatchStatus: {
  //         $in: ['ACCEPTED', DELIVERY_STATUS.OUT_FOR_DELIVERY],
  //       },
  //     })
  //     .sort({ dispatchStatusDate: 1 }) // oldest first
  //     .lean();

  //   if (!order) {
  //     return {
  //       message: 'No pending deliveries',
  //       data: null,
  //     };
  //   }

  //   return {
  //     orderId: order._id,
  //     orderNumber: order.orderNumber,
  //     recipientName: order.recipientName,
  //     recipientPhone: order.recipientPhone,
  //     dropAddress: order.dropAddress,
  //     dropLat: order.dropLat,
  //     dropLng: order.dropLng,
  //     status: order.dispatchStatus,
  //   };
  // }

  async getDriverProfile(driverId: string) {
    try {
      const user = await this.userModel.findById(driverId).lean();

      if (!user) {
        return new ApiResponse(404, {}, Msg.DRIVER_NOT_FOUND);
      }

      const driverVehicle = await this.driverVehicleModel
        .findOne({
          driverId: new Types.ObjectId(driverId),
          isActive: true,
        })
        .populate('vehicleId', 'name description')
        .lean();

      console.log('driverVehicle', driverVehicle);

      const vehicle = driverVehicle?.vehicleId as any as {
        _id: Types.ObjectId;
        name: string;
        description: string;
      };

      user.profilePic = user.profilePic
        ? `${process.env.BASE_URL}/uploads/profile/${user.profilePic}`
        : null;

      const data = {
        ...user,
        vehicle: driverVehicle
          ? {
              id: vehicle._id,
              name: vehicle.name,
              description: vehicle.description,
            }
          : null,
      };

      return new ApiResponse(200, data, Msg.DRIVER_FETCHED);
    } catch (error) {
      console.log('error while getting driver profile:', error);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }
}
