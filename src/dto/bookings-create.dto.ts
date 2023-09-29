import { IsObject, IsDate, IsNumber, IsString, IsNotEmpty, IsMongoId } from 'class-validator';

class PickupSiteDto {
  @IsMongoId()
  _id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

class DeliverSiteDto {
  @IsMongoId()
  _id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateBookingDto {
  @IsMongoId()
  vehicleId: string;

  @IsDate()
  fromDate: Date;

  @IsDate()
  toDate: Date;

  @IsObject()
  @IsNotEmpty()
  pickupSite: PickupSiteDto;

  @IsObject()
  @IsNotEmpty()
  deliverSite: DeliverSiteDto;

  @IsNumber()
  @IsNotEmpty()
  days: number;

  @IsString()
  @IsNotEmpty()
  paymentMethodNonce: string;

  @IsString()
  @IsNotEmpty()
  channel: string;

  @IsString()
  @IsNotEmpty()
  orderId: string;

  @IsString()
  @IsNotEmpty()
  paymentInfo: string;
}
