import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class DeclineOrderDto {
  @IsMongoId()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  reason: string;
}