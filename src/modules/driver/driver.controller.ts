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
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Patch('arrived/order/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.DRIVER)
  markArrived(@Req() req: any, @Param('id') orderId: string) {
    return this.driverService.markArrived(orderId, req.user.id);
  }

  @Patch('delivered/order/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.DRIVER)
  startDelivery(@Req() req: any, @Param('id') orderId: string) {
    return this.driverService.startDelivery(orderId, req.user.id);  
  }

  @Post('complete/order/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.DRIVER)
  @UseInterceptors(FileInterceptor('file'))
  uploadEvidence(@Req() req: any, @Param('id') orderId: string, @UploadedFile() file: Express.Multer.File) {
    return this.driverService.completeDelivery(orderId, req.user.id, file);
  }
}
