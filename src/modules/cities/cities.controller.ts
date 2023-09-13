import { Controller, Get, Post, Put, Delete, Param, Body, Res } from '@nestjs/common';
import { CitiesService } from "./cities.service";
import { Cities } from 'src/models/cities.model';
import { Types } from 'mongoose';
import { ServiceResponse } from 'src/common/utils/services-response';

@Controller('api/cities')
export class CitiesController {
    constructor(private service: CitiesService) { }

    @Get()
    findAll(): Promise<Cities[]> {
        return this.service.findAll();
    }


    @Get('getByCountry/:id')
    async byCountry(@Param('id') id: string, @Res() res) {
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).send(new ServiceResponse(400, "Error", "Invalid country id", null));
        }
        const result = await this.service.getCitiesByCountry(id);
        return res.status(result.statusCode).send(result);
    }

}