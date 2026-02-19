import {
  IsString,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateOrderDto {


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
}
