import { IsString, IsNumber } from 'class-validator';

export class CreateItemCategoryDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;
}   