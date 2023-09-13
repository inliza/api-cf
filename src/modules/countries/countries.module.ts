import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { HelperModule } from 'src/common/helper/helper.module';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Countries, CountrySchema } from 'src/models/countries.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Countries.name, schema: CountrySchema }]),
        CommonModule,
        HelperModule
    ], providers: [CountriesService],
    controllers: [CountriesController]
})
export class CountriesModule { }
