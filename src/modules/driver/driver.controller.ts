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



@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Get('tasks')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.DRIVER)
  getTasks(@Req() req: any, @Query('tab') tab: string) {
    return this.driverService.getDriverTasks(req.user.id, tab);
  }
}
