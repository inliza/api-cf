import { Controller, Get, Res } from "@nestjs/common";
import { UserStatusService } from "./user-status.service";

@Controller('api/user-status')
export class UserStatusController {
    constructor(private service: UserStatusService) { }

    @Get()
    async getAll(@Res() res) {
        const result = await this.service.findAll();
        return res.status(result.statusCode).send(result);
    }
}