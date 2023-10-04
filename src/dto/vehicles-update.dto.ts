import { IsMongoId, IsNumber, IsString, IsArray, Min, MinLength, IsNotEmpty } from 'class-validator';

export class UpdateVehicleDto {

  @IsMongoId()
  @IsNotEmpty()
  _id: string;

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

  @IsNotEmpty()
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
  images: any[];
}
