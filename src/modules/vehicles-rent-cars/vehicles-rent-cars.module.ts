import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { VehicleRentCar, VehicleRentCarSchema } from 'src/models/vehicles-rent-cars.model';
import { VehiclesRentCarsService } from './vehicles-rent-cars.service';
import { VehiclesRentCarsController } from './vehicles-rent-cars.controller';
import { VehiclesStatusModule } from '../vehicles-status/vehicles-status.module';
import { CompaniesPickupsModule } from '../companies-pickups/companies-pickups.module';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: VehicleRentCar.name, schema: VehicleRentCarSchema }]),
        CommonModule,
        VehiclesStatusModule,
        CompaniesPickupsModule,
        BookingsModule
    ],
    providers:[VehiclesRentCarsService],
    controllers: [VehiclesRentCarsController],
    exports:[VehiclesRentCarsService]
})
export class VehiclesRentCarsModule {}
