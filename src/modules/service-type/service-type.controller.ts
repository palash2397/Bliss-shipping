import { Controller } from '@nestjs/common';
import { ServiceTypeService } from './service-type.service';

@Controller('service-type')
export class ServiceTypeController {
  constructor(private readonly serviceTypeService: ServiceTypeService) {}
}
