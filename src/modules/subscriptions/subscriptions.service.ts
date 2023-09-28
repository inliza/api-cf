
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { HttpCallService } from "src/common/helper/http-call.service";
import { LoggerService } from "src/common/logger/logger.service";
import { ServiceResponse } from "src/common/utils/services-response";
import { SubscriptionsCreateDto } from "src/dto/subscriptions-create.dto";
import { Subscriptions } from "src/models/subscriptions.model";
import { SubscriptionsPlansService } from "../subscriptions-plans/subscriptions-plans.service";

@Injectable()
export class SubscriptionsService {
    constructor(
        @InjectModel('Subscriptions') private readonly model: Model<Subscriptions>,
        private readonly http: HttpCallService,
        private readonly _logger: LoggerService,
        private readonly _plans: SubscriptionsPlansService
    ) { }

    async findAll(): Promise<ServiceResponse> {
        try {
            const list = await this.model.find().exec();
            return new ServiceResponse(200, "Ok", "", list);
        } catch (error) {
            this._logger.error(`Subscriptions: Error no controlado findAll ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async getByCompany(companyId): Promise<ServiceResponse> {
        try {
            const sub = await this.model.findOne({
                companyId: companyId,
                deleted: false,
            }).populate({ path: "planId", model: "subscriptionsplans" });
            return new ServiceResponse(200, "Ok", "", sub);
        } catch (error) {
            this._logger.error(`Subscriptions: Error no controlado getByCompany ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async create(payload: SubscriptionsCreateDto, companyId: string): Promise<ServiceResponse> {

        try {
            const url = `${process.env.PAYPAL_URL}v1/billing/subscriptions/${payload}`;
            const res = await this.http.get(url, null, this.getPaypalHeaders())
            const plan = await this._plans.findById(payload.planId);
            if (plan.statusCode !== 200) {
                return new ServiceResponse(400, "", plan.statusCode === 404 ? "Error este plan no existe" : "No se pudo completar su subscripcion en estos momentos", null);
            }
            const sub = new this.model({
                companyId: companyId,
                paypalSubscriptionId: payload.subscriptionId,
                paypalOrderId: payload.orderId,
                planId: plan.object.id,
                subscriberId: res.data?.subscriber?.payer_id
            });
            await sub.save();
            return new ServiceResponse(200, "Ok", "Su subscripcion ha sido completada correctamente", null);
        } catch (error) {
            this._logger.error(`Subscriptions: Error no controlado create ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);

        }

    }

    async cancel(subId: string): Promise<ServiceResponse> {

        try {
            const sub = await this.findById(subId);
            if (sub.statusCode !== 200) {
                return new ServiceResponse(400, "", sub.statusCode === 404 ? "Esta subscripcion no existe" : "No se pudo completar su cancelacion en estos momentos", null);
            }
            const url = `${process.env.PAYPAL_URL}v1/billing/subscriptions/${sub.object.paypalSubscriptionId}/cancel`
            const res = await this.http.post(url, null, this.getPaypalHeaders())
            console.log(`Respuesta de cancelar subscripcion ${res.data}`)
            this.model.findByIdAndUpdate(subId, {
                deleted: true,
            });

            return new ServiceResponse(200, "Ok", "Su subscripcion ha sido cancelada correctamente", null);
        } catch (error) {
            this._logger.error(`Subscriptions: Error no controlado cancel ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);

        }

    }

    async findById(id: string) {
        try {
            const doc = await this.model.findById(id);
            if (!doc) {
                return new ServiceResponse(404, "Subscription not found", "", null);
            }
            return new ServiceResponse(200, "Ok", "", doc);
        } catch (error) {

            this._logger.error(`Subscriptions: Error no controlado findById ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);

        }
    }

    private getPaypalHeaders(): any {
        const credentials = Buffer.from(
            process.env.PAYPAL_CLIENT + ":" + process.env.PAYPAL_KEY).toString("base64");

        return {
            headers: {
                "Authorization": "Basic " + credentials,
                "Content-Type": "application/json"
            },
        }

    }


}