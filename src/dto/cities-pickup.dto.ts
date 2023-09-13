import { IsString, IsMongoId } from 'class-validator';

export class CreateCitiesPickUpDto {
  @IsString()
  name: string;

  @IsMongoId()
  cityId: string;
}

export class SearchCitiesPickUpDto {
  @IsString()
  name: string;
}
