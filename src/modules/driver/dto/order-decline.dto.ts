import { IsString, IsNotEmpty } from 'class-validator';

export class DeclineOrderDto {
  @IsString()
  @IsNotEmpty()
  reason: string;
}