import { IsArray, IsMongoId, IsOptional, IsString } from 'class-validator';

export class PricingPreviewDto {

  @IsMongoId()
  serviceTypeId: string;

  @IsMongoId()
  parcelTypeId: string;

  @IsString()
  pickupLat: string;

  @IsString()
  pickupLng: string;

  @IsString()
  dropLat: string;

  @IsString()
  dropLng: string;


  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialHandling?: string[];
  

  @IsString()
  deliveryType: string;
}

