import { IsNotEmpty, IsString, Length, IsDate, IsMongoId, IsEmail, IsNumber } from 'class-validator';

export class ClientPayCreateOrderDto {

  @IsNotEmpty()
  @IsString()
  coinType: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

}
