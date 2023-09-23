import { IsString, IsEmail, IsMongoId } from 'class-validator';

export class UsersCreateDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsMongoId()
  userType: string;

}
