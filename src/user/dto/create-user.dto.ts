import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  first_name: string;

  last_name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  avatar: string;
}
