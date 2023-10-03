import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { BookingSchema, Bookings } from 'src/models/bookings.model';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { BookingStatusModule } from '../booking-status/booking-status.module';
import { HelperModule } from 'src/common/helper/helper.module';
import { ClientsModule } from '../clients/clients.module';
import { VehiclesRentCarsModule } from '../vehicles-rent-cars/vehicles-rent-cars.module';
import { VehicleRentCar, VehicleRentCarSchema } from 'src/models/vehicles-rent-cars.model';
import { VehiclesStatusModule } from '../vehicles-status/vehicles-status.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Bookings.name, schema: BookingSchema },
            { name: VehicleRentCar.name, schema: VehicleRentCarSchema },

        ]),
        CommonModule,
        BookingStatusModule,
        HelperModule,
        ClientsModule,
        VehiclesStatusModule
    ],
    providers: [BookingsService],
    controllers: [BookingsController],
    exports: [BookingsService]
})
export class BookingsModule {}
