import { IsNotEmpty, IsString, Length, IsDate, IsMongoId, IsEmail, IsNumber } from 'class-validator';

export class ClientPayCaptureOrderDto {

  @IsNotEmpty()
  @IsString()
  orderId: string;

}
