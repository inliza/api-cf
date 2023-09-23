import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Cities, CitySchema } from 'src/models/cities.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Cities.name, schema: CitySchema }]),
        CommonModule,
    ],
    providers:[CitiesService],
    controllers: [CitiesController],
    exports:[CitiesService]

})
export class CitiesModule { }
