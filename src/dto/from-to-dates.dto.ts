import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty } from "class-validator";

export class FromToDatesDto{
    @IsNotEmpty()
    @IsDate()
    @Transform(({value})=> new Date(value))
    fromDate: Date;
  
    @IsNotEmpty()
    @IsDate()
    @Transform(({value})=> new Date(value))
    toDate: Date;
}