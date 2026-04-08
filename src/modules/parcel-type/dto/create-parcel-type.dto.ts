import { IsString, IsNumber, IsMongoId } from 'class-validator';

export class CreateParcelTypeDto {
  @IsString()
  name: string;

  @IsNumber()
  minWeight: number;

  @IsNumber()
  maxWeight: number;

  @IsNumber()
  priceMultiplier: number;

  @IsString()
  description: string;
  
  @IsMongoId()
  @IsString()
  recommendedVehicleId: string;
}