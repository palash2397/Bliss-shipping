import { IsString, IsNotEmpty, IsMongoId, IsNumber, IsOptional } from 'class-validator';

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

  @IsNumber()
  weight: number;

  @IsNumber()
  height: number;

  @IsNumber()
  length: number;

  @IsNumber()
  width: number;

  @IsMongoId()
  serviceType: string;

  @IsMongoId()
  parcelType: string;

  @IsMongoId()
  itemCategory: string;

  @IsMongoId()
  vehicleType: string;

  @IsString()
  @IsOptional()
  note: string;
}
