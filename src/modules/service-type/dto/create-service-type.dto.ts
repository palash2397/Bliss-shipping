import { IsString, IsNumber } from 'class-validator';

export class CreateServiceTypeDto {

  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsString()
  description: string;

  @IsString()
  eta: string;

  @IsNumber()
  basePrice: number;
}