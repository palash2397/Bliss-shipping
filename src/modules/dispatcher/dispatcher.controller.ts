import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  Req,
  Get,
  Patch,
} from '@nestjs/common';

import { DispatcherService } from './dispatcher.service';

import { RoleGuard } from 'src/modules/auth/roles/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/modules/auth/roles/roles.decorator';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt.guard';
import { AssignDriverDto } from './dto/assign-driver.dto';

@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.ADMIN, Role.DISPATCHER)
@Controller('dispatcher')
export class DispatcherController {
  constructor(private readonly dispatcherService: DispatcherService) {}

  @Get('orders')
  getOrders() {
    return this.dispatcherService.allOrders();
  }

  @Get('drivers')
  getDrivers() {
    return this.dispatcherService.allDrivers();
  }

  @Patch('assign/driver')
  assignDriver(@Body() dto: AssignDriverDto, @Req() req: any) {
    return this.dispatcherService.assignDriver(dto, req.user.id);
  }

  @Get('/orders/:filter')
  filterOrders(@Param('filter') filter: string) {
    return this.dispatcherService.filterOrders(filter);
  }

  @Get('/dashboard/counts')
  dashboardCounts() {
    return this.dispatcherService.dashboardCounts();
  }

  @Get('assigned/orders')
  getAssignedOrders(@Req() req: any) {
    return this.dispatcherService.assignedOrders(req.user.id);
  }
}
