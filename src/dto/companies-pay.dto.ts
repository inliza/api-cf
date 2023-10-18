import { IsString, IsNumber, IsMongoId, IsNotEmpty } from 'class-validator';

export class CompaniespayDto {
    @IsMongoId()
    companyId: string;

    @IsMongoId()
    bookingId: string;

    @IsNumber()
    amount: number;

    @IsString()
    @IsNotEmpty()
    subscriberId: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}
