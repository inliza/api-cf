
import { Controller, Get, Res, UseGuards } from "@nestjs/common";
import { AuthMiddleware } from "src/common/middleware/auth.middleware";
import { SubscriptionsService } from "./subscriptions.service";

@Controller('api/subscriptions')
export class SubscriptionsController {
    constructor(private service: SubscriptionsService) { }

    @Get()
    @UseGuards(AuthMiddleware)
    async getAll(@Res() res) {
        const result = await this.service.findAll();
        return res.status(result.statusCode).send(result);
    }

    
}