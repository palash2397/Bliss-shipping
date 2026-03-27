import { IsString } from 'class-validator';

export class CreateItemCategoryDto {
  @IsString()
  name: string;
}   