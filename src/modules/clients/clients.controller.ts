import { Body, Controller, Get, Param, Post, Put, Req, Res, UseGuards } from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { ClientsCreateDto } from "src/dto/clients-create.dto";
import { bodyEmailDto } from "src/dto/forget-password.dto";
import { ClientsUpdateDto } from "src/dto/clients-update.dto";
import { AuthClientMiddleware } from "src/common/middleware/auth-client.middleware";
import { Types } from "mongoose";
import { ServiceResponse } from "src/common/utils/services-response";
import { AuthMiddleware } from "src/common/middleware/auth.middleware";

@Controller('api/clients')
export class ClientsController {
    constructor(private service: ClientsService) { }

    @Get('getById/:id')
    @UseGuards(AuthMiddleware)
    async getById(@Param('id') id: string, @Res() res) {
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).send(new ServiceResponse(400, "Error", "Invalid request", null));
        }
        const result = await this.service.getById(id);
        return res.status(result.statusCode).send(result);
    }

    @Get('me')
    @UseGuards(AuthClientMiddleware)
    async logged(@Req() req, @Res() res) {
        const result = await this.service.getLogged(req.claims.clientId);
        return res.status(result.statusCode).send(result);
    }


    @Post()
    async Save(@Body() payload: ClientsCreateDto, @Res() res) {
        const result = await this.service.create(payload);
        return res.status(result.statusCode).send(result);
    }

    @Put()
    @UseGuards(AuthClientMiddleware)
    async Update(@Body() payload: ClientsUpdateDto, @Req() req, @Res() res) {
        const result = await this.service.put(payload, req.claims.clientId);
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
    
    @Post('forgot-password')
    async ForgetPassword(@Body() payload: bodyEmailDto, @Res() res) {
        const result = await this.service.forgotPassword(payload.email);
        return res.status(result.statusCode).send(result);
    }

}