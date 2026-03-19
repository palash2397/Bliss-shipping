import { IsString, IsNotEmpty, IsMongoId, IsEmpty } from 'class-validator';

export class DeclineOrderDto {
  @IsMongoId()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsEmpty()
  reason: string;
}