import { IsString, IsNotEmpty } from 'class-validator';

export class LoginUserOtpDto {
  @IsNotEmpty()
  @IsString()
  phone: string;
}
