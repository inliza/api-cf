import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { CompaniesPickups, CompaniesPickupsSchema } from 'src/models/companies-pickup.model';
import { CompaniesPickupsService } from './companies-pickups.service';
import { CompaniesPickupsController } from './companies-pickups.controller';
import { CitiesPickUp, CitiesPickupSchema } from 'src/models/cities-pickup.model';
import { Cities, CitySchema } from 'src/models/cities.model';
import { HelperModule } from 'src/common/helper/helper.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CompaniesPickups.name, schema: CompaniesPickupsSchema },
            { name: CitiesPickUp.name, schema: CitiesPickupSchema },
            { name: Cities.name, schema: CitySchema }
        ]),
        CommonModule,
        HelperModule
    ], providers: [CompaniesPickupsService],
    controllers: [CompaniesPickupsController]
})
export class CompaniesPickupsModule { }
