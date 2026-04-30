import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsMongoId,

} from 'class-validator';

export class DriverRegisterDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50, {
    message: 'Name cannot be more than 50 characters',
  })
  name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsOptional()
  phone: string;
  
  @IsNotEmpty()
  @IsString()
  countryCode: string;


  @IsNotEmpty()
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  password: string;


  @IsMongoId()
  @IsString()
  vehicleType: string;



}
