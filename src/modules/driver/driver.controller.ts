import { DriverService } from './driver.service';

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Get,
  Param,
  Query,
  Patch,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt/jwt.guard';

import { RoleGuard } from 'src/modules/auth/roles/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/modules/auth/roles/roles.decorator';

import { DeclineOrderDto } from './dto/order-decline.dto';

@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get('tasks')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.DRIVER)
  getTasks(@Req() req: any, @Query('tab') tab: string) {
    return this.driverService.getDriverTasks(req.user.id, tab);
  }


  @Patch('accept/order/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.DRIVER)
  acceptOrder(@Req() req: any, @Param('id') orderId: string) {
    return this.driverService.acceptOrder(orderId, req.user.id);
  }

  @Patch('decline/order/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.DRIVER)
  declineOrder(@Req() req: any, @Param('id') orderId: string) {
    return this.driverService.declineOrder(orderId, req.user.id);
  } 

  @Patch('orders/arrived/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.DRIVER)
  markArrived(@Req() req: any, @Param('id') orderId: string) {
    return this.driverService.markArrived(orderId, req.user.id);
  }
}
