import { IsMongoId, IsNotEmpty } from "class-validator";

export class VehiclesChangeStatusDto{
    @IsNotEmpty()
    @IsMongoId()
    vehicleId: string;

    @IsNotEmpty()
    @IsMongoId()
    statusId: string;
}