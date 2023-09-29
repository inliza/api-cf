import { Controller, Get, Res } from "@nestjs/common";
import { VehiclesStatusService } from "./vehicles-status.service";

@Controller('api/vehicles-status')
export class VehiclesStatusController {
    constructor(private service: VehiclesStatusService) { }

    @Get()
    async getAll(@Res() res) {
        const result = await this.service.findAll();
        return res.status(result.statusCode).send(result);
    }
}