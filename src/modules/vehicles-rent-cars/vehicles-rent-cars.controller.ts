import { Body, Controller, Delete, Get, Param, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { VehiclesRentCarsService } from "./vehicles-rent-cars.service";
import { AuthCompanyMiddleware } from "src/common/middleware/auth-company.middleware";
import { VehiclesAvailablesDto } from "src/dto/vehicles-available.dto";
import { CreateVehicleDto } from "src/dto/vehicles-create.dto";
import { UpdateVehicleDto } from "src/dto/vehicles-update.dto";
import { Types } from "mongoose";
import { ServiceResponse } from "src/common/utils/services-response";
import { VehiclesChangeStatusDto } from "src/dto/vehicles-change-status.dto";

@Controller('api/vehicles-rent-cars')
export class VehiclesRentCarsController {
    constructor(private service: VehiclesRentCarsService) { }

    @Get()
    @UseGuards(AuthCompanyMiddleware)
    async getAll(@Req() req, @Res() res) {
        const result = await this.service.getByCompany(req.claims.companyId);
        return res.status(result.statusCode).send(result);
    }

    @Get('profile/:id')
    async getProfile(@Param('id') id: string, @Res() res) {
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).send(new ServiceResponse(400, "Error", "Invalid vehicle id", null));
        }
        const result = await this.service.getProfile(id);
        return res.status(result.statusCode).send(result);
    }


    @Get('available')
    async getAvailable(@Body() payload: VehiclesAvailablesDto, @Res() res) {
        const result = await this.service.getAvailable(payload);
        return res.status(result.statusCode).send(result);
    }

    @Get('get-recents')
    async getRecents(@Res() res) {
        const result = await this.service.getRecents();
        return res.status(result.statusCode).send(result);
    }

    @Post()
    @UseGuards(AuthCompanyMiddleware)
    async Create(@Req() req, @Body() payload: CreateVehicleDto, @Res() res) {
        const result = await this.service.create(payload, req.claims.companyId);
        return res.status(result.statusCode).send(result);
    }

    @Put()
    @UseGuards(AuthCompanyMiddleware)
    async Update(@Req() req, @Body() payload: UpdateVehicleDto, @Res() res) {
        const result = await this.service.update(payload);
        return res.status(result.statusCode).send(result);
    }

    @Get('profile/resumed/:id')
    async getProfileResumed(@Param('id') id: string, @Res() res) {
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).send(new ServiceResponse(400, "Error", "Invalid vehicle id", null));
        }

        const result = await this.service.getProfileResumed(id);
        return res.status(result.statusCode).send(result);
    }


    @Put('change-status')
    @UseGuards(AuthCompanyMiddleware)
    async updateStatus(@Body() payload: VehiclesChangeStatusDto, @Res() res) {
        const result = await this.service.changeStatus(payload);
        return res.status(result.statusCode).send(result);
    }

    @Delete()
    @UseGuards(AuthCompanyMiddleware)
    async delete(@Param('id') id: string, @Res() res) {
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).send(new ServiceResponse(400, "Error", "Invalid vehicle id", null));
        }
        const result = await this.service.deleteById(id);
        return res.status(result.statusCode).send(result);
    }



}