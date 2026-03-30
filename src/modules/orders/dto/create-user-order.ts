import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  IsNumber,
} from 'class-validator';

export class CreateUserOrderDto {

  @IsString()
  @IsNotEmpty()
  recipientName: string;

  @IsString()
  @IsNotEmpty()
  recipientPhone: string;

  @IsString()
  pickupAddress: string;

  @IsString()
  pickupLat: string;

  @IsString()
  pickupLng: string;

  @IsString()
  dropAddress: string;

  @IsString()
  dropLat: string;

  @IsString()
  dropLng: string;
 
  @IsMongoId()
  serviceType: string;

  @IsMongoId()
  parcelType: string;

  @IsMongoId()
  itemCategory: string;

  @IsMongoId()
  vehicleType: string;

  @IsString()
  @IsNotEmpty()
  note: string;


}
