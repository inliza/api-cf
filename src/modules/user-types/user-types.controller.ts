import { Controller, Get, Res } from "@nestjs/common";
import { UserTypesService } from "./user-types.service";

@Controller('api/user-types')
export class UserTypesController {
    constructor(private service: UserTypesService) { }

    @Get()
    async getAll(@Res() res) {
        const result = await this.service.findAll();
        return res.status(result.statusCode).send(result);
    }
}