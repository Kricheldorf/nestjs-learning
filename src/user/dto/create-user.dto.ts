import { IsEmail, IsNotEmpty, IsEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  first_name: string;

  last_name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  avatar: string;

  @IsEmpty()
  external_id: number;
}
