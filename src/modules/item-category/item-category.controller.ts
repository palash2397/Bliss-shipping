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
import { ItemCategoryService } from './item-category.service';

import { RoleGuard } from 'src/modules/auth/roles/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/modules/auth/roles/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';

import { CreateItemCategoryDto } from './dto/create-item-category.dto';


@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('item-category')
export class ItemCategoryController {
  constructor(private readonly itemCategoryService: ItemCategoryService) {}

  @Post('create')
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateItemCategoryDto) {
    return this.itemCategoryService.create(dto);
  }

  @Get('all')
  @Roles(Role.ADMIN, Role.USER, Role.DRIVER)
  findAll() {
    return this.itemCategoryService.findAll();
  }

  @Get('find/:id')
  @Roles(Role.ADMIN, Role.USER, Role.DRIVER)
  findOne(@Param('id') id: string) {
    return this.itemCategoryService.findOne(id);
  }
}
