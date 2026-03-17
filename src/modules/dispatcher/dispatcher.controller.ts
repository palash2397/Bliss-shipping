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

@Controller('dispatcher')
export class DispatcherController {
  constructor(private readonly dispatcherService: DispatcherService) {}
}
