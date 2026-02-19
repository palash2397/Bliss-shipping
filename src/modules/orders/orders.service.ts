import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Connection } from 'mongoose';

import { InjectConnection } from '@nestjs/mongoose';
import { parse } from 'csv-parse';
import { startSession } from 'mongoose';

import { Msg } from '../../utils/helpers/responseMsg';
import { ApiResponse } from '../../utils/helpers/ApiResponse';

import { Order, OrderDocument } from './schemas/order.schema';
import { User, UserDocument } from '../user/schemas/user.schema';
import {
  Merchant,
  MerchantDocument,
} from '../merchant/schemas/merchant-profile.schema';

import { DELIVERY_STATUS } from '../../common/enums/delivery-status.enum';

import { CreateOrderDto } from './dto/create-order';
import { FilterOrdersDto } from './dto/filter-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Merchant.name)
    private readonly merchantModel: Model<MerchantDocument>,

    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async createOrder(dto: CreateOrderDto, userId: string) {
    try {
      const merchant = await this.merchantModel.findOne({
        userId: new Types.ObjectId(userId),
      });
      if (!merchant) {
        return new ApiResponse(404, {}, Msg.MERCHANT_NOT_FOUND);
      }
      const orderNumber = `BS-${Date.now()}`;

      const order = await this.orderModel.create({
        ...dto,
        merchantId: merchant._id,
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
    const merchant = await this.merchantModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    console.log('merchant', merchant);

    if (!merchant) {
      return {
        importedCount: 0,
        failedRows: [{ rowNumber: 0, error: Msg.MERCHANT_NOT_FOUND }],
      };
    }

    const session = await this.connection.startSession();
    session.startTransaction();

    type OrderInsertType = {
      merchantId: Types.ObjectId;
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
          merchantId: merchant._id,
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
          merchantId: merchant._id as Types.ObjectId,
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
          dispatchStatus: 'CREATED',
          paymentStatus: 'PENDING',
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
      const merchant = await this.merchantModel.findOne({
        userId: new Types.ObjectId(userId),
      });
      if (!merchant) {
        return new ApiResponse(404, {}, Msg.MERCHANT_NOT_FOUND);
      }
      const skip = (page - 1) * limit;

      const [orders, total] = await Promise.all([
        this.orderModel
          .find({
            merchantId: merchant._id,
            isDeleted: false,
          })
          .populate('merchantId', 'contactName')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),

        this.orderModel.countDocuments({
          merchantId: merchant._id,
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
      const merchant = await this.merchantModel.findOne({
        userId: new Types.ObjectId(userId),
      });
      if (!merchant) {
        return new ApiResponse(404, {}, Msg.MERCHANT_NOT_FOUND);
      }
      const order = await this.orderModel
        .findOne({ _id: new Types.ObjectId(orderId), merchantId: merchant._id })
        .populate('merchantId', 'contactName')
        .lean();
      if (!order) {
        return new ApiResponse(404, {}, Msg.ORDER_NOT_FOUND);
      }
      return new ApiResponse(200, order, Msg.ORDER_FETCHED);
    } catch (error) {
      console.log(`Error finding order by id: ${error}`);
      return new ApiResponse(500, {}, Msg.SERVER_ERROR);
    }
  }

  async filterOrders(userId: string, query: FilterOrdersDto) {
    try {
      const merchant = await this.merchantModel.findOne({
        userId: new Types.ObjectId(userId),
      });

      if (!merchant) {
        return new ApiResponse(404, {}, Msg.MERCHANT_NOT_FOUND);
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
        merchantId: merchant._id,
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

  async merchantSummary(userId: string) {
    const merchant = await this.merchantModel.findOne({ userId });

    if (!merchant) {
      return new ApiResponse(404, {}, Msg.MERCHANT_NOT_FOUND);
    }

    const merchantId = merchant._id;

    const [total, delivered, inTransit, failed] = await Promise.all([
      this.orderModel.countDocuments({
        merchantId,
        isDeleted: false,
      }),

      this.orderModel.countDocuments({
        merchantId,
        dispatchStatus: DELIVERY_STATUS.DELIVERED,
        isDeleted: false,
      }),

      this.orderModel.countDocuments({
        merchantId,
        dispatchStatus: DELIVERY_STATUS.OUT_FOR_DELIVERY,
        isDeleted: false,
      }),

      this.orderModel.countDocuments({
        merchantId,
        dispatchStatus: DELIVERY_STATUS.FAILED,
        isDeleted: false,
      }),
    ]);

    return {
      total,
      delivered,
      inTransit,
      failed,
    };
  }
}
