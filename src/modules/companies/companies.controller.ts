import { Body, Controller, Post, Res } from "@nestjs/common";
import { CompaniesService } from "./companies.service";
import { CompanyCreateDto } from "src/dto/companies-create.dto";

@Controller('api/companies')
export class CompaniesController {
    constructor(private service: CompaniesService) { }

    @Post()
    async Save(@Body() payload: CompanyCreateDto, @Res() res) {
        const result = await this.service.createCompany(payload);
        return res.status(result.statusCode).send(result);
    }
}

