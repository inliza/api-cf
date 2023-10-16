import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { PaymentsClientsService } from "./payments-client.service";
import { AuthClientMiddleware } from "src/common/middleware/auth-client.middleware";
import { ClientPayCreateOrderDto } from "src/dto/client-pay-create-order.dto";
import { ClientPayCaptureOrderDto } from "src/dto/client-pay-capture-order.dto";

@Controller('api/client-payments')
export class PaymentsClientsController {
    constructor(private service: PaymentsClientsService) { }


    @Post('create-order')
    @UseGuards(AuthClientMiddleware)
    async createOrder(@Body() payload: ClientPayCreateOrderDto, @Req() req, @Res() res) {
        const result = await this.service.createOrder(payload);
        return res.status(result.statusCode).send(result);
    }

    @Post('capture-order')
    @UseGuards(AuthClientMiddleware)
    async capture(@Body() payload: ClientPayCaptureOrderDto, @Req() req, @Res() res) {
        const result = await this.service.captureOrder(payload);
        return res.status(result.statusCode).send(result);
    }


    @Get('by-client')
    @UseGuards(AuthClientMiddleware)
    async get(@Req() req, @Res() res) {
        
        const result = await this.service.getByClient(req.claims.clientId);
        return res.status(result.statusCode).send(result);
    }

    
}