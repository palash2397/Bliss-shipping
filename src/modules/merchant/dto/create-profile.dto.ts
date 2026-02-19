import {
  IsString,
  IsNotEmpty,

  IsMongoId,
  
} from 'class-validator';

export class CreateMerchantDto {
   
  @IsMongoId()
  @IsNotEmpty()
  merchantId: string;
  
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  contactName: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  province: string;

  @IsString()
  postalCode: string;
}
