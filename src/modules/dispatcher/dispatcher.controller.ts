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

@Controller('dispatcher')
export class DispatcherController {
  constructor(private readonly dispatcherService: DispatcherService) {}
}
