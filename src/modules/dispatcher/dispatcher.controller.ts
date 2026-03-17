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

@Controller('dispatcher')
export class DispatcherController {
  constructor(private readonly dispatcherService: DispatcherService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.DISPATCHER)
  @Get('orders')
  getOrders() {
    return this.dispatcherService.allOrders();
  }
}
