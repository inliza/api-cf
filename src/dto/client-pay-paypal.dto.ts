import { IsMongoId, IsNumber, IsString } from 'class-validator';

export class ClientPayByPaypalDto {
  @IsMongoId()
  vehicleId: string;

  @IsMongoId()
  companyId: string;

  @IsMongoId()
  bookingId: string;

  @IsNumber()
  amount: number;

  @IsString()
  coinType: string;

  @IsString()
  paymentNonce: string;

  @IsString()
  channel: string;

  @IsString()
  orderId: string;

  @IsString()
  paymentInfo: string;
}
