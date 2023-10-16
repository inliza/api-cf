import { IsMongoId, IsNumber, IsString, IsArray, Min, IsNotEmpty, ArrayMinSize } from 'class-validator';

export class BookingsIdDto {

  @IsNotEmpty()
  @IsMongoId()
  bookingId: string;

}
