import { IsNotEmpty, IsString, Length, IsDate, IsMongoId, IsEmail } from 'class-validator';

export class SubscriptionsCreateDto {

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  subscriptionId: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  orderId: string;

  @IsNotEmpty()
  @IsString()
  planId: string;

}
