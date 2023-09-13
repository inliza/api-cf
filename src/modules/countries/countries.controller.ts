import { Controller, Get, Res } from "@nestjs/common";
import { CountriesService } from "./countries.service";

@Controller('api/countries')
export class CountriesController {
    constructor(private service: CountriesService) { }

    @Get()
    async byCountry(@Res() res) {
        const result = await this.service.findAll();
       return res.status(result.statusCode).send(result);
    }
}