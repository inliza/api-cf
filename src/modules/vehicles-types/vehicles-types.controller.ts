import { Controller, Get, Res } from "@nestjs/common";
import { VehiclesTypesService } from "./vehicles-types.service";

@Controller('api/vehicle-types')
export class VehiclesTypesController {
    constructor(private service: VehiclesTypesService) { }

    @Get()
    async getAll(@Res() res) {
        const result = await this.service.findAll();
        return res.status(result.statusCode).send(result);
    }
}