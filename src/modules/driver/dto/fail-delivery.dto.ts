import { IsString, IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';

export class FailDeliveryDto {
  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsMongoId()
  orderId: string;
}
