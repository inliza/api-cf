
import { Body, Controller, Get, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { AuthMiddleware } from "src/common/middleware/auth.middleware";
import { SubscriptionsService } from "./subscriptions.service";
import { SubscriptionsCreateDto } from "src/dto/subscriptions-create.dto";
import { AuthCompanyMiddleware } from "src/common/middleware/auth-company.middleware";
import { SubscriptionsCancelDto } from "src/dto/subscriptions-cancel.dto";

@Controller('api/subscriptions')
export class SubscriptionsController {
    constructor(private service: SubscriptionsService) { }

    @Get()
    @UseGuards(AuthMiddleware)
    async getAll(@Res() res) {
        const result = await this.service.findAll();
        return res.status(result.statusCode).send(result);
    }

    @Post()
    @UseGuards(AuthCompanyMiddleware)
    async create(@Body() payload: SubscriptionsCreateDto, @Req() req, @Res() res) {
        const result = await this.service.create(payload, req.claims.companyId);
        return res.status(result.statusCode).send(result);
    }

    @Put('cancel')
    @UseGuards(AuthCompanyMiddleware)
    async cancel(@Body() payload: SubscriptionsCancelDto, @Res() res) {
        const result = await this.service.cancel(payload);
        return res.status(result.statusCode).send(result);
    }

    @Get('by-company')
    @UseGuards(AuthCompanyMiddleware)
    async getByCompany(@Req() req, @Res() res) {
        const result = await this.service.getByCompany(req.claims.companyId);
        return res.status(result.statusCode).send(result);
    }

    
}