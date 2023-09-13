import { Body, Controller, Get, Param, Post, Query, Res } from "@nestjs/common";
import { CitiesPickupService } from "./cities-pickup.service";
import { CreateCitiesPickUpDto, SearchCitiesPickUpDto } from "src/dto/cities-pickup.dto";
import { Types } from "mongoose";
import { ServiceResponse } from "src/common/utils/services-response";

@Controller('api/cities-pickup')
export class CitiesPickupController {
    constructor(private service: CitiesPickupService) { }

    @Get('get/:id')
    async getPickUpsByCity(@Param('id') id: string, @Res() res) {
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).send(new ServiceResponse(400, "Error", "Invalid pickup id", null));
        }
        const result = await this.service.getPickUpsByCity(id);
        return res.status(result.statusCode).send(result);

    }

    @Get('getById/:id')
    async getPickUpById(@Param('id') id: string, @Res() res) {
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).send(new ServiceResponse(400, "Error", "Invalid pickup id", null));
        }
        const result = await this.service.getPickUpById(id);
        return res.status(result.statusCode).send(result);

    }

    @Get('search')
    async searchPickUps(@Query() searchDto: SearchCitiesPickUpDto, @Res() res) {
        const result = await this.service.searchPickUps(searchDto);
        return res.status(result.statusCode).send(result);

    }

    @Post()
    async createPickUp(@Body() createDto: CreateCitiesPickUpDto, @Res() res) {
        const result = await this.service.createPickUp(createDto);
        return res.status(result.statusCode).send(result);

    }
}