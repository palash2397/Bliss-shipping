import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Connection } from 'mongoose';

import { InjectConnection } from '@nestjs/mongoose';
import { parse } from 'csv-parse';

import { Msg } from '../../utils/helpers/responseMsg';
import { ApiResponse } from '../../utils/helpers/ApiResponse';

import { Order, OrderDocument } from './schemas/order.schema';
import { User, UserDocument } from '../user/schemas/user.schema';
import {
  ImportHistory,
  ImportHistoryDocument,
} from './schemas/import-history.schema';

import {
  Merchant,
  MerchantDocument,
} from '../merchant/schemas/merchant-profile.schema';

import { ItemCategory, ItemCategoryDocument } from '../item-category/schemas/item-category.schema';
import { Vehicle, VehicleDocument } from '../vehicle/schemas/vehicle.schema';
import { ParcelType, ParcelTypeDocument } from '../parcel-type/schemas/parcel-type.schema';
import { ServiceType, ServiceTypeDocument } from '../service-type/schemas/service-type';

import { DELIVERY_STATUS } from '../../common/enums/delivery-status.enum';
import { STATUS } from '../../common/enums/status.enum';
import { CSV_IMPORT_STATUS } from 'src/common/enums/csv-import-history.enum';

import { CreateOrderDto } from './dto/create-order';
import { FilterOrdersDto } from './dto/filter-order.dto';

import { CreateUserOrderDto } from './dto/create-user-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Merchant.name)
    private readonly merchantModel: Model<MerchantDocument>,
    @InjectModel(ImportHistory.name)
    private readonly importHistoryModel: Model<ImportHistoryDocument>,

    @InjectModel(ItemCategory.name)
    private readonly itemCategoryModel: Model<ItemCategoryDocument>,

  
    @InjectModel(Vehicle.name)
    private readonly vehicleModel: Model<VehicleDocument>,

    @InjectModel(ParcelType.name)
    private readonly parcelTypeModel: Model<ParcelTypeDocument>,

    @InjectModel(ServiceType.name)
    private readonly serviceTypeModel: Model<ServiceTypeDocument>,

    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async createOrder(dto: CreateOrderDto, userId: string) {
    try {
      const user = await this.userModel.findOne({
        _id: new Types.ObjectId(userId),
      });
      if (!user) {
        return new ApiResponse(404, {}, Msg.USER_NOT_FOUND);
      }
      const orderNumber = `BS-${Date.now()}`;

      const order = await this.orderModel.create({
        ...dto,
        userId: user._id,
        orderNumber,
        dispatchStatus: 'CREATED',
        paymentStatus: 'PENDING',
      });

      return new ApiResponse(201, order, Msg.ORDER_CREATED);
    } catch (error) {
      console.log(`error creating order: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async importCsv(
    userId: string,
    fileBuffer: Buffer,
  ): Promise<{
    importedCount: number;
    failedRows: { rowNumber: number; error: string }[];
  }> {
    const user = await this.userModel.findOne({
      _id: new Types.ObjectId(userId),
    });
    if (!user) {
      return {
        importedCount: 0,
        failedRows: [{ rowNumber: 0, error: Msg.USER_NOT_FOUND }],
      };
    }

    const session = await this.connection.startSession();
    session.startTransaction();

    type OrderInsertType = {
      userId: Types.ObjectId;
      orderNumber: string;
      externalOrderId: string;
      recipientName: string;
      recipientPhone: string;
      pickupAddress: string;
      pickupLat: number;
      pickupLng: number;
      dropAddress: string;
      dropLat: number;
      dropLng: number;
      dispatchStatus: 'CREATED';
      paymentStatus: 'PENDING';
    };

    const records: OrderInsertType[] = [];
    const failedRows: { rowNumber: number; error: string }[] = [];

    let rowNumber = 1;

    const parser = parse(fileBuffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    for await (const row of parser) {
      rowNumber++;

      try {
        if (
          !row.externalOrderId ||
          !row.recipientName ||
          !row.recipientPhone ||
          !row.dropAddress
        ) {
          throw new Error('Missing required fields');
        }

        const existing = await this.orderModel.findOne({
          userId: user._id,
          externalOrderId: row.externalOrderId,
        });

        if (existing) {
          throw new Error('Duplicate externalOrderId');
        }

        const pickupLat = Number(row.pickupLat);
        const pickupLng = Number(row.pickupLng);
        const dropLat = Number(row.dropLat);
        const dropLng = Number(row.dropLng);

        if (
          isNaN(pickupLat) ||
          isNaN(pickupLng) ||
          isNaN(dropLat) ||
          isNaN(dropLng)
        ) {
          throw new Error('Invalid coordinates');
        }

        records.push({
          userId: user._id,
          orderNumber: `BS-${Date.now()}-${rowNumber}`,
          externalOrderId: row.externalOrderId,
          recipientName: row.recipientName,
          recipientPhone: row.recipientPhone,
          pickupAddress: row.pickupAddress,
          pickupLat,
          pickupLng,
          dropAddress: row.dropAddress,
          dropLat,
          dropLng,
          dispatchStatus: DELIVERY_STATUS.CREATED,
          paymentStatus: STATUS.PENDING,
        });

        await this.importHistoryModel.create({
          userId: user._id,
          fileName: 'orders_upload.csv',
          totalRows: records.length + failedRows.length,
          successRows: records.length,
          failedRows: failedRows.length,
          status:
            failedRows.length === 0
              ? CSV_IMPORT_STATUS.SUCCESS
              : records.length === 0
                ? CSV_IMPORT_STATUS.FAILED
                : CSV_IMPORT_STATUS.PARTIAL,
        });
      } catch (error: any) {
        failedRows.push({
          rowNumber,
          error: error.message,
        });
      }
    }

    try {
      if (records.length > 0) {
        await this.orderModel.insertMany(records, { session });
      }

      await session.commitTransaction();
      session.endSession();

      return {
        importedCount: records.length,
        failedRows,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      return {
        importedCount: 0,
        failedRows: [{ rowNumber: 0, error: Msg.SERVER_ERROR }],
      };
    }
  }

  async findAllOrders(userId: string, page: number, limit: number) {
    try {
      const user = await this.userModel.findOne({
        _id: new Types.ObjectId(userId),
      });
      if (!user) {
        return new ApiResponse(404, {}, Msg.USER_NOT_FOUND);
      }
      const skip = (page - 1) * limit;

      const [orders, total] = await Promise.all([
        this.orderModel
          .find({
            userId: user._id,
            isDeleted: false,
          })
          .populate('userId', 'name email')
          .populate('statusHistory.updatedBy', 'name')
          .populate('assignedDriverId', 'name phone')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),

        this.orderModel.countDocuments({
          userId: user._id,
          isDeleted: false,
        }),
      ]);

      return new ApiResponse(200, { orders, total }, Msg.ORDERS_FETCHED);
    } catch (error) {
      console.log(`Error finding all orders: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async findOrderById(orderId: string, userId: string) {
    try {
      let folderName = 'pod';
      const user = await this.userModel.findOne({
        _id: new Types.ObjectId(userId),
      });
      if (!user) {
        return new ApiResponse(404, {}, Msg.USER_NOT_FOUND);
      }
      const order = await this.orderModel
        .findOne({ _id: new Types.ObjectId(orderId), userId: user._id })
        .populate('assignedDriverId', 'name phoneNumber')
        .populate('userId', 'name email')
        .populate('statusHistory.updatedBy', 'name phoneNumber')
        .lean();
      if (!order) {
        return new ApiResponse(404, {}, Msg.ORDER_NOT_FOUND);
      }

      if (order.dispatchStatus == DELIVERY_STATUS.FAILED) {
        folderName = 'failed';
      }

      order.podImage = order.podImage
        ? `${process.env.BASE_URL}/uploads/${folderName}/${order.podImage}`
        : null;
      return new ApiResponse(200, order, Msg.ORDER_FETCHED);
    } catch (error) {
      console.log(`Error finding order by id: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async filterOrders(userId: string, query: FilterOrdersDto) {
    try {
      const user = await this.userModel.findOne({
        _id: new Types.ObjectId(userId),
      });
      if (!user) {
        return new ApiResponse(404, {}, Msg.USER_NOT_FOUND);
      }

      const {
        status,
        search,
        fromDate,
        toDate,
        page = '1',
        limit = '10',
      } = query;

      const filter: any = {
        userId: user._id,
        isDeleted: false,
      };

      if (status) {
        filter.dispatchStatus = status;
      }

      if (search) {
        filter.$or = [
          { orderNumber: { $regex: search, $options: 'i' } },
          { externalOrderId: { $regex: search, $options: 'i' } },
        ];
      }

      if (fromDate || toDate) {
        filter.createdAt = {};
        if (fromDate) filter.createdAt.$gte = new Date(fromDate);
        if (toDate) filter.createdAt.$lte = new Date(toDate);
      }

      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
      const skip = (pageNumber - 1) * limitNumber;

      const [orders, total] = await Promise.all([
        this.orderModel
          .find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limitNumber)
          .lean(),
        this.orderModel.countDocuments(filter),
      ]);

      return new ApiResponse(200, { orders, total }, Msg.ORDERS_FETCHED);
    } catch (error) {
      console.log(`Error filtering orders: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async merchantSummary(id: string) {
    try {
       const user = await this.userModel.findOne({
        _id: new Types.ObjectId(id),
      });
      if (!user) {
        return new ApiResponse(404, {}, Msg.USER_NOT_FOUND);
      }
      const userId = user._id;

      const [total, delivered, inTransit, failed] = await Promise.all([
        this.orderModel.countDocuments({
          userId,
          isDeleted: false,
        }),

        this.orderModel.countDocuments({
          userId,
          dispatchStatus: DELIVERY_STATUS.DELIVERED,
          isDeleted: false,
        }),

        this.orderModel.countDocuments({
          userId,
          dispatchStatus: DELIVERY_STATUS.OUT_FOR_DELIVERY,
          isDeleted: false,
        }),

        this.orderModel.countDocuments({
          userId,
          dispatchStatus: DELIVERY_STATUS.FAILED,
          isDeleted: false,
        }),

        // this.orderModel.countDocuments({
        //   merchantId,
        //   dispatchStatus: DELIVERY_STATUS.CREATED,
        //   isDeleted: false,
        // }),
      ]);

      return new ApiResponse(
        200,
        { total, delivered, inTransit, failed },
        Msg.MERCHANT_SUMMARY_FETCHED,
      );
    } catch (error) {
      console.log(`Error getting merchant summary: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async recentOrders(userId: string, type: string) {
    try {
      const user = await this.userModel.findOne({
        _id: new Types.ObjectId(userId),
      });

      if (!user) {
        return new ApiResponse(404, {}, Msg.USER_NOT_FOUND);
      }

      const userIdd = user._id;

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const tomorrowStart = new Date(todayStart);
      tomorrowStart.setDate(todayStart.getDate() + 1);

      const tomorrowEnd = new Date(tomorrowStart);
      tomorrowEnd.setDate(tomorrowStart.getDate() + 1);

      let filter: any = {
        userId: userIdd,
        isDeleted: false,
      };

      if (type === 'today') {
        filter.createdAt = { $gte: todayStart };
      }

      if (type === 'tomorrow') {
        filter.createdAt = {
          $gte: tomorrowStart,
          $lt: tomorrowEnd,
        };
      }

      if (type === 'scheduled') {
        filter.dispatchStatus = 'SCHEDULED';
      }

      const orders = await this.orderModel
        .find(filter)
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();
      return new ApiResponse(200, orders, Msg.ORDERS_FETCHED);
    } catch (error) {
      console.log(`Error getting recent orders: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async cancelOrder(userId: string, orderId: string) {
    try {
      const user = await this.userModel.findOne({
        _id: new Types.ObjectId(userId),
      });
      console.log('user', user);
      if (!user) {
        return new ApiResponse(404, {}, Msg.USER_NOT_FOUND);
      }

      const order = await this.orderModel.findById(orderId);
      if (!order) {
        return new ApiResponse(404, {}, Msg.ORDER_NOT_FOUND);
      }

      if (order.dispatchStatus == DELIVERY_STATUS.CANCELLED) {
        return new ApiResponse(400, {}, Msg.ORDER_ALREADY_CANCELLED);
      }

      if (order.dispatchStatus !== DELIVERY_STATUS.CREATED) {
        return new ApiResponse(400, {}, Msg.ORDER_CANNOT_BE_CANCELLED);
      }

      await this.orderModel.findByIdAndUpdate(orderId, {
        dispatchStatus: DELIVERY_STATUS.CANCELLED,
        dispatchStatusDate: new Date(),
        $push: {
          statusHistory: {
            status: DELIVERY_STATUS.CANCELLED,
            time: new Date(),
            updatedBy: new Types.ObjectId(userId),
          },
        },
      });

      return new ApiResponse(200, {}, Msg.ORDER_CANCELLED);
    } catch (error) {
      console.log(`Error cancelling order: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async importHistory(userId: string) {
    try {
      const user = await this.userModel.findOne({
        _id: new Types.ObjectId(userId),
      });

      console.log('user', user);

      if (!user) {
        return new ApiResponse(404, {}, Msg.USER_NOT_FOUND);
      }

      const data = await this.importHistoryModel
        .find({ userId: user._id })
        .sort({ createdAt: -1 })
        .limit(20)
        .lean();

      if (!data || data.length === 0) {
        return new ApiResponse(404, {}, Msg.IMPORT_HISTORY_NOT_FOUND);
      }

      return new ApiResponse(200, data, Msg.IMPORT_HISTORY_FETCHED);
    } catch (error) {
      console.log(`Error getting import history: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }



  async createUserOrder(dto: CreateOrderDto, userId: string) {
    try {
      
    } catch (error) {
      console.log(`Error creating user order: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
    
  }


}



}
