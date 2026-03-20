import { Controller, Post, Param, Body, Req, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';

import { RoleGuard } from 'src/modules/auth/roles/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/modules/auth/roles/roles.decorator';
import { JwtAuthGuard } from 'src/modules/auth/jwt/jwt.guard';

import { CreateRatingDto } from './dto/create-feedback.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.MERCHANT)
  @Post('order/rating')
  createRating(@Body() dto: CreateRatingDto, @Req() req: any) {
    return this.feedbackService.createRating(req.user.id, dto);
  }
}
