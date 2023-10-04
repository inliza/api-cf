import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { VehicleRentCar, VehicleRentCarSchema } from 'src/models/vehicles-rent-cars.model';
import { VehiclesRentCarsService } from './vehicles-rent-cars.service';
import { VehiclesRentCarsController } from './vehicles-rent-cars.controller';
import { VehiclesStatusModule } from '../vehicles-status/vehicles-status.module';
import { CompaniesPickupsModule } from '../companies-pickups/companies-pickups.module';
import { BookingsModule } from '../bookings/bookings.module';
import { HelperModule } from 'src/common/helper/helper.module';
import { MakesModule } from '../makes/makes.module';
import { ModelsModule } from '../models/models.module';
import { VehiclesFuelModule } from '../vehicles-fuel/vehicles-fuel.module';
import { VehiclesTypesModule } from '../vehicles-types/vehicles-types.module';
import { VehicleImagesModule } from '../vehicle-images/vehicle-images.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: VehicleRentCar.name, schema: VehicleRentCarSchema }]),
        CommonModule,
        VehiclesStatusModule,
        CompaniesPickupsModule,
        BookingsModule,
        HelperModule,
        MakesModule,
        ModelsModule,
        VehiclesFuelModule,
        VehiclesTypesModule,
        VehicleImagesModule
    ],
    providers:[VehiclesRentCarsService],
    controllers: [VehiclesRentCarsController],
    exports:[VehiclesRentCarsService]
})
export class VehiclesRentCarsModule {}
