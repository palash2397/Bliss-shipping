import { Controller, Post, Body, UseGuards, Param, Req, Get } from '@nestjs/common';
import { MerchantService } from './merchant.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';

import { RoleGuard } from 'src/modules/auth/roles/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/modules/auth/roles/roles.decorator';

import { CreateMerchantDto } from './dto/create-profile.dto';

@Controller('merchant')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('admin/profile')
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateMerchantDto) {
    return this.merchantService.createProfile(dto);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('profile')
  @Roles(Role.MERCHANT)
  profile(@Req() req: any) {
    return this.merchantService.profile(req.user.id);
  }
}
