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

@Injectable()
export class PaymentsClientsService {
    constructor(
        @InjectModel('PaymentsClients') private readonly model: Model<PaymentsClients>,
        private readonly _status: PaymentsStatusService,
        private readonly _types: PaymentsTypesService,
        private readonly _channel: PaymentsChannelsService,
        private readonly _operations: OperationsService,
        private readonly _logger: LoggerService
    ) { }

    async payByPaypal(payload: ClientPayByPaypalDto, clientId: string): Promise<ServiceResponse> {
        try {
            const status = await this._status.findByName("Processed");
            if (!status) {
                return new ServiceResponse(404, "Error", "Error en configuracion. Estados Pagos", null);
            }

            const type = await this._types.findByName("Booking Payment");
            if (!type) {
                return new ServiceResponse(404, "Error", "Error en configuracion. Tipo Pagos", null);
            }

            const channel = await this._channel.findByName(payload.channel);
            if (!channel) {
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


}