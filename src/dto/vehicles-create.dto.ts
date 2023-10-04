import { IsMongoId, IsNumber, IsString, IsArray, Min, MinLength } from 'class-validator';

export class CreateVehicleDto {
  @IsMongoId()
  makeId: string;

  @IsMongoId()
  companyId: string;

  @IsMongoId()
  modelId: string;

  @IsMongoId()
  fuelTypeId: string;

  @IsMongoId()
  vehicleTypeId: string;

  @IsNumber({}, { each: true })
  @Min(2000)
  year: number;

  @IsNumber()
  @Min(0)
  priceByDay: number;

  @IsString()
  coinType: string;

  @IsString()
  placa: string;

  @IsArray()
  @MinLength(1)
  images: string[];
}
