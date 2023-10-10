import { IsMongoId, IsNumber, IsString, IsArray, Min, MinLength, IsNotEmpty } from 'class-validator';

export class CreateVehicleDto {
  @IsNotEmpty()
  @IsMongoId()
  makeId: string;

  @IsNotEmpty()
  @IsMongoId()
  modelId: string;

  @IsNotEmpty()
  @IsMongoId()
  fuelTypeId: string;

  @IsNotEmpty()
  @IsMongoId()
  vehicleTypeId: string;

  @IsNumber({}, { each: true })
  @Min(2000)
  year: number;

  @IsNumber()
  @Min(0)
  priceByDay: number;

  @IsNotEmpty()
  @IsString()
  coinType: string;

  @IsNotEmpty()
  @IsString()
  placa: string;

  @IsArray()
  @MinLength(1)
  images: string[];
}
