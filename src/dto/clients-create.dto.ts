import { IsNotEmpty, IsString, Length, IsDate, IsMongoId, IsEmail } from 'class-validator';

export class ClientsCreateDto {

  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  phone: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
  

}
