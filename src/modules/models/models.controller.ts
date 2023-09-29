import { Controller, Get, Param, Res } from "@nestjs/common";
import { ModelsService } from "./models.service";
import { Types } from "mongoose";
import { ServiceResponse } from "src/common/utils/services-response";

@Controller('api/models')
export class ModelsController {
    constructor(private service: ModelsService) { }


    @Get(":id")
    async getById(@Param('id') id: string, @Res() res) {
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).send(new ServiceResponse(400, "Error", "Invalid model id", null));
        }
        const result = await this.service.getByMake(id);
        return res.status(result.statusCode).send(result);
    }

}