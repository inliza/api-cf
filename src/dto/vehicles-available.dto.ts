import { Transform } from "class-transformer";
import { IsDate, IsMongoId, IsNotEmpty } from "class-validator";

export class VehiclesAvailablesDto{
    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    fromDate: Date;
  
    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    toDate: Date;

    @IsNotEmpty()
    @IsMongoId()
    pickupId: string;
}