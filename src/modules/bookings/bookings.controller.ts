import { Controller } from "@nestjs/common";
import { BookingsService } from "./bookings.service";

@Controller('api/bookings')
export class BookingsController {
    constructor(private service: BookingsService) {

     }
}