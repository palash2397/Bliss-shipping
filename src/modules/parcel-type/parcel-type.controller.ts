import { Controller } from '@nestjs/common';
import { ParcelTypeService } from './parcel-type.service';

@Controller('parcel-type')
export class ParcelTypeController {
  constructor(private readonly parcelTypeService: ParcelTypeService) {}
}
