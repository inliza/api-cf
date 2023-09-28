import { Controller, Get, Res, UseGuards } from "@nestjs/common";
import { SubscriptionsPlansService } from "./subscriptions-plans.service";
import { AuthMiddleware } from "src/common/middleware/auth.middleware";

@Controller('api/subscriptions-plans')
export class SubscriptionsPlansController {
    constructor(private service: SubscriptionsPlansService) { }

    @Get()
    @UseGuards(AuthMiddleware)
    async getAll(@Res() res) {
        const result = await this.service.findAll();
        return res.status(result.statusCode).send(result);
    }
}