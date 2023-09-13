import { Controller, Get, Param, Post, Req, Res, UseGuards } from "@nestjs/common";
import { CompaniesPickupsService } from "./companies-pickups.service";
import { Types } from "mongoose";
import { ServiceResponse } from "src/common/utils/services-response";
import { AuthMiddleware } from "src/common/middleware/auth.middleware";

@Controller('api/companies-pickup')
export class CompaniesPickupsController {
    constructor(private service: CompaniesPickupsService) { }

    @Get('getCompanies/:pickup')
    async getCompaniesByPickup(@Param('pickup') pickup: string, @Res() res) {
        if (!Types.ObjectId.isValid(pickup)) {
            return res.status(400).send(new ServiceResponse(400, "Error", "Invalid pickup id", null));
        }
        const result = await this.service.getCompaniesByPickup(pickup);
        return res.status(result.statusCode).send(result);
    }

    @Get('getPickupsByCompany/:company')
    async getPickupsByCompany(@Param('company') company: string, @Res() res) {
        if (!Types.ObjectId.isValid(company)) {
            return res.status(400).send(new ServiceResponse(400, "Error", "Invalid pickup id", null));
        }
        const result = await this.service.getPickupsByCompany(company);
        return res.status(result.statusCode).send(result);
    }

    @Post()
    @UseGuards(AuthMiddleware)
    async Save(@Req() req, @Res() res) {
        const result = await this.service.savePickups(req.body, req.claims._id);
        return res.status(result.statusCode).send(result);
    }


    @Get()
    @UseGuards(AuthMiddleware)
    async getAll(@Req() req, @Res() res) {
      const result = await this.service.getAllPickups(req.claims._id);
      return res.status(result.statusCode).send(result);
    }

}


