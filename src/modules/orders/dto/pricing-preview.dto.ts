import { IsMongoId, IsString } from 'class-validator';

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
}