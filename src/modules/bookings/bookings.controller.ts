import { Body, Controller, Delete, Get, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import { AuthClientMiddleware } from "src/common/middleware/auth-client.middleware";
import { CreateBookingDto } from "src/dto/bookings-create.dto";
import { Types } from "mongoose";
import { ServiceResponse } from "src/common/utils/services-response";
import { AuthCompanyMiddleware } from "src/common/middleware/auth-company.middleware";
import { AuthMiddleware } from "src/common/middleware/auth.middleware";
import { BookingsIdDto } from "src/dto/bookings-id.dto";

@Controller('api/bookings')
export class BookingsController {
    constructor(private service: BookingsService) {}

    @Post()
    @UseGuards(AuthClientMiddleware)
    async create(@Req() req, @Body() payload: CreateBookingDto, @Res() res) {
        const result = await this.service.create(payload, req.claims.clientId);
        return res.status(result.statusCode).send(result);
    }


    @Get()
    @UseGuards(AuthClientMiddleware)
    async get(@Req() req, @Res() res) {
        const result = await this.service.getByClient(req.claims.clientId);
        return res.status(result.statusCode).send(result);
    }

    @Get('reserved-dates/:vehicleId')
    async getReservedDates(@Param('vehicleId') id: string, @Res() res) {
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).send(new ServiceResponse(400, "Error", "Invalid vehicle id", null));
        }
        const result = await this.service.getReservedDatesByVehicle(id);
        return res.status(result.statusCode).send(result);
    }


    @Post('/cancel-booking/byClient')
    @UseGuards(AuthClientMiddleware)
    async cancelByClient(@Body() payload: BookingsIdDto, @Res() res) {
        const result = await this.service.cancelByClient(payload);
        return res.status(result.statusCode).send(result);
    }


    @Delete('delete/:id')
    @UseGuards(AuthClientMiddleware)
    async delete(@Param('id') id: string, @Res() res) {
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).send(new ServiceResponse(400, "Error", "Invalid booking id", null));
        }
        const result = await this.service.deleteById(id);
        return res.status(result.statusCode).send(result);
    }

    @Get('hasBeenBooking/:vehicleId')
    async hasBeenBooking(@Param('vehicleId') id: string, @Res() res) {
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).send(new ServiceResponse(400, "Error", "Invalid vehicle id", null));
        }
        const result = await this.service.hasBeenBooking(id);
        return res.status(result.statusCode).send(result);
    }

    @Get('getByRentcar')
    @UseGuards(AuthCompanyMiddleware)
    async getByRentCar(@Req() req, @Res() res) {
        const result = await this.service.getByCompany(req.claims.companyId);
        return res.status(result.statusCode).send(result);
    }

    @Get('getById/:id')
    @UseGuards(AuthMiddleware)
    async getById(@Param('id') id: string,  @Res() res) {
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).send(new ServiceResponse(400, "Error", "Invalid booking id", null));
        }
        const result = await this.service.findById(id);
        return res.status(result.statusCode).send(result);
    }

    @Get('bookings-to-pay')
    @UseGuards(AuthMiddleware)
    async toPay(@Res() res) {
        const result = await this.service.bookingsToPay();
        return res.status(result.statusCode).send(result);
    }

    @Post('/notific')
    @UseGuards(AuthClientMiddleware)
    async send(@Req() req, @Res() res) {
        const result = await this.service.sendNotification(req.body);
        return res.status(result.statusCode).send(result);
    }

    @Post('bookings-to-progress')
    @UseGuards(AuthMiddleware)
    async toProgress(@Res() res) {
        const result = await this.service.bookingToProgress();
        return res.status(result.statusCode).send(result);
    }

    @Post('bookings-to-completed')
    @UseGuards(AuthMiddleware)
    async toComplete(@Res() res) {
        const result = await this.service.bookingsToComplete();
        return res.status(result.statusCode).send(result);
    }

}