import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';

import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { RoleGuard } from 'src/modules/auth/roles/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/modules/auth/roles/roles.decorator';
import { ApiResponse } from 'src/utils/helpers/ApiResponse';
import { Msg } from 'src/utils/helpers/responseMsg';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.MERCHANT, Role.ADMIN)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('merchant/create')
  create(@Body() dto: CreateOrderDto, @Req() req: any) {
    return this.ordersService.createOrder(dto, req.user.id);
  }

  @Post('import/csv')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype !== 'text/csv' &&
          !file.originalname.endsWith('.csv')
        ) {
          cb(new BadRequestException('Only CSV files are allowed'), false);
        } else {
          cb(null, true);
        }
      },
    }),
  )
  async importCsv(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    if (!file) {
      throw new BadRequestException('CSV file is required');
    }

    const result = await this.ordersService.importCsv(req.user.id, file.buffer);

    return new ApiResponse(200, result, Msg.ORDERS_IMPORTED);
  }

  @Get('/all')
  findAll(@Req() req: any) {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    return this.ordersService.findAllOrders(
      req.user.id,
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }
}
