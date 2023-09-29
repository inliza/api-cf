import { Controller, Get, Res } from "@nestjs/common";
import { VehiclesFuelService } from "./vehicles-fuel.service";

@Controller('api/vehicle-fuels')
export class VehiclesFuelController {
    constructor(private service: VehiclesFuelService) { }

    @Get()
    async getAll(@Res() res) {
        const result = await this.service.findAll();
        return res.status(result.statusCode).send(result);
    }
}