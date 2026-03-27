import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  UploadedFile,
  Get,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { ServiceTypeService } from './service-type.service';

import { RoleGuard } from 'src/modules/auth/roles/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/modules/auth/roles/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';

import { CreateServiceTypeDto } from './dto/create-service-type.dto';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('service-type')
export class ServiceTypeController {
  constructor(private readonly serviceTypeService: ServiceTypeService) {}


  @Post('create')
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateServiceTypeDto) {
    return this.serviceTypeService.create(dto);
  }
  
  @Get('all')
  @Roles(Role.ADMIN, Role.DRIVER)
  findAll() {
    return this.serviceTypeService.findAll();
  }
}
