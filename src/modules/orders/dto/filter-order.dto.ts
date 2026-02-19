import { IsOptional, IsEnum, IsString } from 'class-validator';
import { STATUS } from '../../../common/enums/status.enum';

export class FilterOrdersDto {
  @IsOptional()
  @IsEnum(STATUS)
  status?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  fromDate?: string;

  @IsOptional()
  @IsString()
  toDate?: string;

  @IsOptional()
  page?: string;

  @IsOptional()
  limit?: string;
}
