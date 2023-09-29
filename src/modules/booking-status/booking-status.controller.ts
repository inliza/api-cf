import { Controller, Get, Res } from "@nestjs/common";
import { BookingStatusService } from "./booking-status.service";

@Controller('api/bookings-status')
export class BookingStatusController {
    constructor(private service: BookingStatusService) { }

    @Get()
    async getAll(@Res() res) {
        const result = await this.service.findAll();
        return res.status(result.statusCode).send(result);
    }
}