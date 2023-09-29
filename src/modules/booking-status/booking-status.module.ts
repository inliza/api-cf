import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from 'src/common/common.module';
import { BookingStatus, BookingStatusSchema } from 'src/models/bookings-status.model';
import { BookingStatusService } from './booking-status.service';
import { BookingStatusController } from './booking-status.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: BookingStatus.name, schema: BookingStatusSchema }]),
        CommonModule
    ],
    providers: [BookingStatusService],
    controllers: [BookingStatusController],
    exports: [BookingStatusService]
})
export class BookingStatusModule {}
