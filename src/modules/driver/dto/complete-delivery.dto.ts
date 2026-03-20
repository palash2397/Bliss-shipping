import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class CompleteDeliveryDto {
  @IsMongoId()
  @IsNotEmpty()
  orderId: string;


}
