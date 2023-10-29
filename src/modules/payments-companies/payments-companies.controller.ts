import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { PaymentsCompaniesService } from "./payments-companies.service";
import { AuthCompanyMiddleware } from "src/common/middleware/auth-company.middleware";
import { AuthMiddleware } from "src/common/middleware/auth.middleware";
import { CompaniespayDto } from "src/dto/companies-pay.dto";

@Controller('api/companies-payments')
export class PaymentsCompaniesController {
    constructor(private service: PaymentsCompaniesService) { }

    @Get('by-company')
    @UseGuards(AuthCompanyMiddleware)
    async get(@Req() req, @Res() res) {
        const result = await this.service.getByCompany(req.claims.companyId);
        return res.status(result.statusCode).send(result);
    }

    @Post('pay')
    @UseGuards(AuthMiddleware)
    async pay(@Body() payload: CompaniespayDto, @Res() res) {
        const result = await this.service.proccessPayment(payload);
        return res.status(result.statusCode).send(result);
    }
}