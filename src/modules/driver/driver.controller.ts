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


import { ApiResponse } from 'src/utils/helpers/ApiResponse';
import { Msg } from 'src/utils/helpers/responseMsg';

@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  
}
