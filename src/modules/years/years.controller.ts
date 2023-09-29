import { Controller, Get, Res } from "@nestjs/common";
import { YearsService } from "./years.service";

@Controller('api/years')
export class YearsController {
    constructor(private service: YearsService) { }

    @Get()
    async getAll(@Res() res) {
        const result = await this.service.findAll();
        return res.status(result.statusCode).send(result);
    }
}