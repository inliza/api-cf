import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoggerService } from "src/common/logger/logger.service";
import { ServiceResponse } from "src/common/utils/services-response";
import { ClientPayByPaypalDto } from "src/dto/client-pay-paypal.dto";
import { PaymentsClients } from "src/models/payments-client.model";
import { PaymentsStatusService } from "../payments-status/payments-status.service";
import { PaymentsTypesService } from "../payments-types/payments-types.service";
import { PaymentsChannelsService } from "../payments-channels/payments-channels.service";
import { v4 as uuidv4 } from 'uuid';
import { OperationsService } from "src/common/helper/operations.service";
import { ClientPayCreateOrderDto } from "src/dto/client-pay-create-order.dto";
import { HttpCallService } from "src/common/helper/http-call.service";
import { ClientPayCaptureOrderDto } from "src/dto/client-pay-capture-order.dto";
import { BookingsIdDto } from "src/dto/bookings-id.dto";

@Injectable()
export class PaymentsClientsService {
    constructor(
        @InjectModel('PaymentsClients') private readonly model: Model<PaymentsClients>,
        private readonly _status: PaymentsStatusService,
        private readonly _types: PaymentsTypesService,
        private readonly _channel: PaymentsChannelsService,
        private readonly _operations: OperationsService,
        private readonly _logger: LoggerService,
        private readonly http: HttpCallService,

    ) { }

    async payByPaypal(payload: ClientPayByPaypalDto, clientId: string): Promise<ServiceResponse> {
        try {
            const status = await this._status.findByName("Processed");
            if (status.statusCode !== 200) {
                return new ServiceResponse(404, "Error", "Error en configuracion. Estados Pagos", null);
            }

            const type = await this._types.findByName("Booking Payment");
            if (type.statusCode !== 200) {
                return new ServiceResponse(404, "Error", "Error en configuracion. Tipo Pagos", null);
            }

            const channel = await this._channel.findByName(payload.channel);
            if (channel.statusCode !== 200) {
                return new ServiceResponse(404, "Error", "Error en configuracion. Tipo Canal", null);
            }

            const transactionGuid = uuidv4();

            let payment = new this.model({
                clientId: clientId,
                vehicleId: payload.vehicleId,
                companyId: payload.companyId,
                bookingId: payload.bookingId,
                amount: payload.amount,
                coinType: payload.coinType,
                transactionGuid: transactionGuid,
                paymentNonce: payload.paymentNonce,
                paymentType: type.object.id,
                paymentStatus: status.object.id,
                paymentChannel: channel.object.id,
                transactionId: payload.orderId,
                paymentInfo:
                    "Paypal | Cuenta: " +
                    this._operations.maskEmail(payload.paymentInfo),
            });

            await payment.save();
            return new ServiceResponse(200, "Ok", "", { guid: transactionGuid, amount: payload.amount });
        } catch (error) {
            this._logger.error(`PaymentsClients: Error no controlado payByPaypal ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);

        }
    }

    async createOrder(payload: ClientPayCreateOrderDto): Promise<ServiceResponse> {
        try {
            const url = `${process.env.PAYPAL_URL}v2/checkout/orders`;
            const data = {
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: payload.coinType,
                            value: payload.amount,
                        },
                    },
                ],
            };
            const res = await this.http.post(url, data, this.getPaypalHeaders())
            return new ServiceResponse(200, "Ok", "", res.data);
        } catch (error) {
            this._logger.error(`PaymentsClientsService: Error no controlado createOrder ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);

        }
    }

    async captureOrder(payload: ClientPayCaptureOrderDto): Promise<ServiceResponse> {
        try {
            const url = `${process.env.PAYPAL_URL}v2/checkout/orders/${payload.orderId}/capture`;
            const res = await this.http.post(url, null, this.getPaypalHeaders())
            return new ServiceResponse(200, "Ok", "", res.data);
        } catch (error) {
            this._logger.error(`PaymentsClientsService: Error no controlado captureOrder ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);

        }
    }

    async refundPayment(bookingId: string): Promise<ServiceResponse> {
        try {
            const payment = await this.model.findOne({
                bookingId: bookingId
            });
            const amountToRefund = (payment.amount * 0.5).toString();

            const status = await this._status.findByName("Refunded by client");
            if (status.statusCode !== 200) {
                return new ServiceResponse(404, "Error", "Error en configuracion. Estados Pagos", null);
            }

            const url = `${process.env.PAYPAL_URL}v2/payments/captures/${payment.paymentNonce}/refund`;
            const data = { value: amountToRefund, currency_code: "USD" }
            const res = await this.http.post(url, data, this.getPaypalHeaders());
            await this.model.findByIdAndUpdate(
                payment._id,
                {
                    paymentStatus: status.object._id,
                });
            this._logger.info(`Pago reembolsado booking ${bookingId} client ${payment.clientId} `)
            return new ServiceResponse(200, "Ok", "", res.data);
        } catch (error) {
            this._logger.error(`PaymentsClientsService: Error no controlado captureOrder ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);

        }
    }

    async getByClient(clientId: string): Promise<ServiceResponse> {
        try {
            const payments = await this.model.find({
                clientId: clientId
              })
                .select("bookingId coinType paymentInfo createdDate amount")
                .sort({ createdDate: -1 });
            return new ServiceResponse(200, "Ok", "", payments);
        } catch (error) {
            this._logger.error(`PaymentsClientsService: Error no controlado createOrder ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);

        }
    }


    private getPaypalHeaders(): any {
        const credentials = Buffer.from(
            process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_SECRET).toString("base64");

        return {
            headers: {
                "Authorization": "Basic " + credentials,
                "Content-Type": "application/json"
            },
        }

    }


}