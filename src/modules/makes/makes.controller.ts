import { Controller, Get, Param, Res } from "@nestjs/common";
import { MakesService } from "./makes.service";
import { Types } from "mongoose";
import { ServiceResponse } from "src/common/utils/services-response";

@Controller('api/makes')
export class MakesController {
    constructor(private service: MakesService) { }

    @Get()
    async getAll(@Res() res) {
        const result = await this.service.findAll();
        return res.status(result.statusCode).send(result);
    }

    @Get("getById/:id")
    async getById(@Param('id') id: string, @Res() res) {
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).send(new ServiceResponse(400, "Error", "Invalid make id", null));
        }
        const result = await this.service.findById(id);
        return res.status(result.statusCode).send(result);
    }

}