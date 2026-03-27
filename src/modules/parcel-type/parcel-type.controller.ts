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
import { ParcelTypeService } from './parcel-type.service';

import { RoleGuard } from 'src/modules/auth/roles/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/modules/auth/roles/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';

import { CreateParcelTypeDto } from './dto/create-parcel-type.dto';

@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('parcel-type')
export class ParcelTypeController {
  constructor(private readonly parcelTypeService: ParcelTypeService) {}

  @Post('create')
  @Roles(Role.ADMIN, Role.USER, Role.DRIVER)
  create(@Body() createParcelTypeDto: CreateParcelTypeDto) {
    return this.parcelTypeService.create(createParcelTypeDto);
  }

  @Get('all')
  @Roles(Role.ADMIN, Role.USER, Role.DRIVER)
  findAll() {
    return this.parcelTypeService.findAll();
  }

  @Get('/find/:id')
  @Roles(Role.ADMIN, Role.USER, Role.DRIVER)
  findOne(@Param('id') id: string) {
    return this.parcelTypeService.findOne(id);
  }
}
