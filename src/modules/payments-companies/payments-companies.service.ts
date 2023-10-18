import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoggerService } from "src/common/logger/logger.service";
import { ServiceResponse } from "src/common/utils/services-response";
import { PaymentsCompany } from "src/models/payments-company.model";
import { PaymentsStatusService } from "../payments-status/payments-status.service";
import { v4 as uuidv4 } from 'uuid';
import { CompaniespayDto } from "src/dto/companies-pay.dto";
import { HttpCallService } from "src/common/helper/http-call.service";

@Injectable()
export class PaymentsCompaniesService {
    constructor(
        @InjectModel('PaymentsCompany') private readonly model: Model<PaymentsCompany>,
        private readonly _status: PaymentsStatusService,
        private readonly http: HttpCallService,
        private readonly _logger: LoggerService,
    ) { }

    async getByCompany(companyId: string): Promise<ServiceResponse> {
        try {
            const payments = await this.model.find({
                companyId: companyId
            })
                .select("bookingId coinType description createdDate amount")
                .sort({ createdDate: -1 });
            return new ServiceResponse(200, "Ok", "", payments);
        } catch (error) {
            this._logger.error(`PaymentsCompany: Error no controlado getByCompany ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);

        }
    }

    async proccessPayment(payload: CompaniespayDto): Promise<ServiceResponse> {
        try {
            const pay = await this.model.findOne({
                bookingId: payload.bookingId,
                deleted: false,
            });
            if (pay) {
                this._logger.warn(`Se intento procesar un pago a una reserva que ya habia sido procesado ${payload.bookingId}`)
                return new ServiceResponse(
                    HttpStatus.AMBIGUOUS,
                    "Validacion pago duplicado",
                    "Esta reserva ya tiene un pago procesado",
                    null
                );
            }

            const paymentStatus = await this._status.findByName("Processed");
            if (paymentStatus.statusCode !== HttpStatus.OK) {
                return paymentStatus;
            }

            const url = process.env.PAYPAL_URL + "payments/payouts";
            const date = new Date();
            const guid = uuidv4();
            const data = {
                sender_batch_header: {
                    sender_batch_id: `Payouts_${date.getTime()}`,
                    email_subject: "Pago recibido de Carros Facil",
                    email_message:
                        "Usted ha recibido un pago, gracias por confiar en Carros Facil!",
                },
                items: [
                    {
                        recipient_type: "PAYPAL_ID",
                        amount: {
                            value: payload.amount,
                            currency: "USD",
                        },
                        note: "Gracias por ser parte de Carros Facil",
                        sender_item_id: date.getTime(),
                        receiver: payload.subscriberId,
                        notification_language: "en-US",
                    },
                ],
            };
            const res = await this.http.post(url, data, this.getPaypalHeaders());
            this._logger.info(`Recibiendo respuesta de paypal. Pago a ${payload.companyId}`)
            const payment = new this.model({
                companyId: payload.companyId,
                subscriberId: payload.subscriberId,
                bookingId: payload.bookingId,
                amount: payload.amount,
                coinType: "USD",
                transactionGuid: guid,
                batch_id: `Payouts_${date.getTime()}`,
                payout_batch_id: res.data.batch_header.payout_batch_id,
                paymentStatus: paymentStatus.object.id,
                description: payload.description,
            });

            await payment.save();
            return new ServiceResponse(200, "Ok", "", res.data);

        } catch (error) {
            this._logger.error(`PaymentsCompany: Error no controlado proccessPayment ${error}`);
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