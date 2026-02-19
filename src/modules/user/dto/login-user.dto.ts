import {
  IsEmail,
  IsNotEmpty,
  MinLength,

} from 'class-validator';

export class LoginUserDto {

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;


  @IsNotEmpty()
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
 
  password: string;

}
