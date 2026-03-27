import { IsString, IsNumber } from 'class-validator';

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
}