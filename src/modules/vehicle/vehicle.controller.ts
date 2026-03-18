import { VehicleService } from './vehicle.service';

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Req,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt/jwt.guard';

import { RoleGuard } from 'src/modules/auth/roles/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/modules/auth/roles/roles.decorator';

import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { AssignVehicleDto } from './dto/assign-vehicle.dto';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  create(@Body() createVehicleDto: CreateVehicleDto, @Req() req: any) {
    return this.vehicleService.createVehicle(createVehicleDto);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.DRIVER)
  findAll() {
    return this.vehicleService.allVehicles();
  }

  @Post('assign/driver')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.DRIVER)
  assignVehicle(@Req() req: any, @Body() dto: AssignVehicleDto) {
    return this.vehicleService.assignVehicle(req.user.id, dto);
  }


  @Get('assign/driver')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.DRIVER)
  myAssignVehicle(@Req() req: any) {
    return this.vehicleService.myAssignVehicle(req.user.id);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.DRIVER)
  vehicleHistory(@Req() req: any) {
    return this.vehicleService.vehicleHistory(req.user.id);
  }

  @Delete('delete/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  deleteVehicle(@Param('id') id: string) {
    return this.vehicleService.deleteVehicle(id);
  }

}
