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

import { multerConfig } from 'src/common/middleware/multer';

import { RoleGuard } from 'src/modules/auth/roles/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/modules/auth/roles/roles.decorator';

import { DeclineOrderDto } from './dto/order-decline.dto';
import { FailDeliveryDto } from './dto/fail-delivery.dto';
import { FileInterceptor } from '@nestjs/platform-express';

import { DriverRegisterDto } from './dto/driver-register.dto';
import { LoginUserDto } from 'src/modules/user/dto/login-user.dto';

@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post('register')
  register(@Body() dto: DriverRegisterDto) {
    return this.driverService.registerDriver(dto);
  }

  @Post('login')
  login(@Body() dto: LoginUserDto) {
    return this.driverService.login(dto);
  }

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


  @Patch('picked-up/order/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.DRIVER)
  markPickedUp(@Req() req: any, @Param('id') orderId: string) {
    return this.driverService.pickedUp(orderId, req.user.id);
  } 

  @Patch('delivered/order/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.DRIVER)
  startDelivery(@Req() req: any, @Param('id') orderId: string) {
    return this.driverService.startDelivery(orderId, req.user.id);
  }

  @Patch('complete/order/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.DRIVER)
  @UseInterceptors(FileInterceptor('file', multerConfig('pod')))
  uploadEvidence(
    @Req() req: any,
    @Param('id') orderId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.driverService.completeDelivery(orderId, req.user.id, file);
  }

  @Patch('fail/delivery')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.DRIVER)
  @UseInterceptors(FileInterceptor('file', multerConfig('failed')))
  failDelivery(
    @Req() req: any,
    @Body() dto: FailDeliveryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.driverService.failDelivery(req.user.id, dto, file);
  }

  @Get('order/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.DRIVER)
  getOrderDetail(@Req() req: any, @Param('id') orderId: string) {
    return this.driverService.getOrderDetail(orderId, req.user.id);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.DRIVER)
  getProfile(@Req() req: any) {
    return this.driverService.getDriverProfile(req.user.id);
  }

  @Patch('update/assign/vehicle/:vehicleId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.DRIVER, Role.ADMIN)
  assignVehicle(@Req() req: any, @Param('vehicleId') vehicleId: string) {
    return this.driverService.updateAssignVehicle(req.user.id, vehicleId);
  }
}
