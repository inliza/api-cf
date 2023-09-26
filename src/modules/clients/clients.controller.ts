import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { ClientsCreateDto } from "src/dto/clients-create.dto";

@Controller('api/clients')
export class ClientsController {
    constructor(private service: ClientsService) { }

    @Get()
    async getAll(@Res() res) {
        const result = await this.service.findAll();
        return res.status(result.statusCode).send(result);
    }

    @Post()
    async Save(@Body() payload: ClientsCreateDto, @Res() res) {
        const result = await this.service.create(payload);
        return res.status(result.statusCode).send(result);
    }

    @Post('confirmation/checkCode')
    async CheckCode(@Body() payload: { code: string }, @Res() res) {
        const result = await this.service.checkCode(payload.code);
        return res.status(result.statusCode).send(result);
    }

    @Post('confirmation')
    async ConfirmAccount(@Body() payload: { code: string }, @Res() res) {
        const result = await this.service.confirmateAccount(payload.code);
        return res.status(result.statusCode).send(result);
    }


}