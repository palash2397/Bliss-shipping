import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { AssignDriverDto } from './dto/assign-driver.dto';
import { DELIVERY_STATUS } from '../../common/enums/delivery-status.enum';

import { ApiResponse } from 'src/utils/helpers/ApiResponse';
import { Msg } from 'src/utils/helpers/responseMsg';

@Injectable()
export class DispatcherService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    ) {}

    allOrders(){
        try {
            
        } catch (error) {
            
        }
    }
    

}
