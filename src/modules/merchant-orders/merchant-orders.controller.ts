import { Controller } from '@nestjs/common';
import { MerchantOrdersService } from './merchant-orders.service';

@Controller('merchant-orders')
export class MerchantOrdersController {
  constructor(private readonly merchantOrdersService: MerchantOrdersService) {}
}
