import { Controller, Get, Res } from "@nestjs/common";
import { DocumentsTypesService } from "./documents-types.service";

@Controller('api/documents-types')
export class DocumentsTypesController {
    constructor(private service: DocumentsTypesService) { }

    @Get()
    async getAll(@Res() res) {
        const result = await this.service.findAll();
        return res.status(result.statusCode).send(result);
    }
}