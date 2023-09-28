import { Body, Controller, Get, Param, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { CompaniesService } from "./companies.service";
import { CompanyCreateDto } from "src/dto/companies-create.dto";
import { Types } from "mongoose";
import { ServiceResponse } from "src/common/utils/services-response";
import { AuthMiddleware } from "src/common/middleware/auth.middleware";
import { AuthCompanyMiddleware } from "src/common/middleware/auth-company.middleware";
import { CompanyUpdateDto } from "src/dto/companies-update.dto";
import { bodyEmailDto } from "src/dto/forget-password.dto";

@Controller('api/companies')
export class CompaniesController {
    constructor(
        private service: CompaniesService,
    ) { }

    @Post()
    async Save(@Body() payload: CompanyCreateDto, @Res() res) {
        const result = await this.service.createCompany(payload);
        return res.status(result.statusCode).send(result);
    }

    @Get("getById/:id")
    async getById(@Param('id') id: string, @Res() res) {
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).send(new ServiceResponse(400, "Error", "Invalid company id", null));
        }
        const result = await this.service.getLoggedInfo(id);
        return res.status(result.statusCode).send(result);
    }

    @Get("logged")
    @UseGuards(AuthCompanyMiddleware)
    async getLoggedInfo(@Req() req, @Res() res) {
        const result = await this.service.getLoggedInfo(req.claims.companyId);
        return res.status(result.statusCode).send(result);
    }

    @Get()
    @UseGuards(AuthMiddleware)
    async getAll(@Res() res) {
        const result = await this.service.getAll();
        return res.status(result.statusCode).send(result);
    }

    @Put()
    @UseGuards(AuthCompanyMiddleware)
    async put(@Body() payload: CompanyUpdateDto, @Req() req, @Res() res) {
        const result = await this.service.put(payload, req.claims.companyId);
        return res.status(result.statusCode).send(result);
    }


    @Post('forgot-password')
    async ForgetPassword(@Body() payload: bodyEmailDto, @Res() res) {
        const result = await this.service.forgotPassword(payload.email);
        return res.status(result.statusCode).send(result);
    }

    @Post('confirmation/checkCode')
    async CheckCode(@Body() payload: { code: string }, @Res() res) {
        const result = await this.service.checkCode(payload.code);
        return res.status(result.statusCode).send(result);
    }

    @Post('validateCompany')
    async Validate(@Body() payload: bodyEmailDto, @Res() res) {
        const result = await this.service.validateCompany(payload.email);
        return res.status(result.statusCode).send(result);
    }

}

