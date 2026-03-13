import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  
} from 'class-validator';

import { CreateMerchantDto } from './create-profile.dto';

export class UpdateMerchantDto extends CreateMerchantDto {
  
}