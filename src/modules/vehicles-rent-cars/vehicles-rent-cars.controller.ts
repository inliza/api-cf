import { Body, Controller, Get, Param, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { VehiclesRentCarsService } from "./vehicles-rent-cars.service";
import { AuthCompanyMiddleware } from "src/common/middleware/auth-company.middleware";
import { VehiclesAvailablesDto } from "src/dto/vehicles-available.dto";
import { CreateVehicleDto } from "src/dto/vehicles-create.dto";
import { UpdateVehicleDto } from "src/dto/vehicles-update.dto";

@Controller('api/vvehicles-rent-cars')
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
        const result = await this.service.getProfile(id);
        return res.status(result.statusCode).send(result);
    }


    @Get('available')
    async getAvailable(@Body() payload: VehiclesAvailablesDto, @Res() res) {
        const result = await this.service.getAvailable(payload);
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
}