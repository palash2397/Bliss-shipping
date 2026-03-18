import {
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';

export class CreateVehicleDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  
  @IsOptional()
  @IsString()
  description?: string;
}