import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { BookingSchema, Bookings } from 'src/models/bookings.model';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { BookingStatusModule } from '../booking-status/booking-status.module';
import { HelperModule } from 'src/common/helper/helper.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Bookings.name, schema: BookingSchema }]),
        CommonModule,
        BookingStatusModule,
        HelperModule
    ],
    providers: [BookingsService],
    controllers: [BookingsController],
    exports: [BookingsService]
})
export class BookingsModule {}
