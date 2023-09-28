import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length, IsDate, IsMongoId, IsEmail, IsOptional } from 'class-validator';

export class ClientsUpdateDto {

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

  @IsOptional()
  @IsString()
  @Length(1, 1024)
  address: string;

  @IsOptional()
  @IsDate()
  @Transform(({value})=> new Date(value))
  birthday: Date;


  @IsOptional()
  @IsMongoId()
  documentType: string;

  @IsOptional()
  @IsString()
  @Length(8, 15)
  document: string;

  @IsOptional()
  @IsMongoId()
  gender: string;


}
