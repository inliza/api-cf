import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoggerService } from "src/common/logger/logger.service";
import { ServiceResponse } from "src/common/utils/services-response";
import { SubscriptionsPlans } from "src/models/subscriptions-plans.model";

@Injectable()
export class SubscriptionsPlansService {
    constructor(
        @InjectModel('SubscriptionsPlans') private readonly model: Model<SubscriptionsPlans>,
        private readonly _logger: LoggerService
    ) { }

    async findAll(): Promise<ServiceResponse> {
        try {
            const list = await this.model.find({deleted:false}).exec();
            return new ServiceResponse(200, "Ok", "", list);
        } catch (error) {
            this._logger.error(`SubscriptionsPlans: Error no controlado findAll ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async findById(id: string) {
        try {
            const doc = await this.model.findById(id);
            if (!doc) {
                return new ServiceResponse(404, "SubscriptionsPlans not found", "", null);
            }
            return new ServiceResponse(200, "Ok", "", doc);
        } catch (error) {

            this._logger.error(`SubscriptionsPlans: Error no controlado findById ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);

        }
    }

}