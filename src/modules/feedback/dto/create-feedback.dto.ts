import {
  IsInt,
  Min,
  Max,
  IsOptional,
  IsString,
  IsMongoId,
} from 'class-validator';

export class CreateRatingDto {
  @IsString()
  @IsMongoId()
  orderId: string;

  @IsOptional()
  @IsString()
  @IsMongoId()
  userId?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  feedback?: string;
}
