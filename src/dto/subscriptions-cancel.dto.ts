import { IsNotEmpty, IsString, Length, IsDate, IsMongoId, IsEmail } from 'class-validator';

export class SubscriptionsCancelDto {

  @IsNotEmpty()
  @IsString()
  @Length(1, 100)
  subId: string;

}
