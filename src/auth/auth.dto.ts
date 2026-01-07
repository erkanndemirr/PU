import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  username: string;

  @MinLength(2)
  firstName: string;

  @MinLength(2)
  lastName: string;

  @MinLength(6)
  password: string;
}


export class LoginDto {
  username: string;
  password: string;
}
