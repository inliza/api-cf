import { IsNotEmpty, IsString, Length, IsMongoId } from 'class-validator';

export class CompanyUpdateDto {

  @IsNotEmpty()
  @IsString()
  @Length(8, 15)
  document: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 15)
  rnc: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 1024)
  address: string;

  @IsNotEmpty()
  @IsMongoId()
  city: string;


  @IsNotEmpty()
  @IsString()
  @Length(5, 50)
  ownerName: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  mobileNumber: string;

}
