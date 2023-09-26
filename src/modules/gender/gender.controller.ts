import { Controller, Get, Res, UseGuards } from "@nestjs/common";
import { GenderService } from "./gender.service";
import { AuthMiddleware } from "src/common/middleware/auth.middleware";

@Controller('api/gender')
export class GenderController {
    constructor(private service: GenderService) { }

    @Get()
    @UseGuards(AuthMiddleware)
    async getAll(@Res() res) {
        const result = await this.service.findAll();
        return res.status(result.statusCode).send(result);
    }
}