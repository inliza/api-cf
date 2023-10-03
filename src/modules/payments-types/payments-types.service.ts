import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoggerService } from "src/common/logger/logger.service";
import { ServiceResponse } from "src/common/utils/services-response";
import { PaymentsClients } from "src/models/payments-client.model";
import { PaymentsTypes } from "src/models/payments-types.model";

@Injectable()
export class PaymentsTypesService {
    constructor(
        @InjectModel('PaymentsTypes') private readonly model: Model<PaymentsTypes>,
        private readonly _logger: LoggerService
    ) { }

    async findByName(name: string) : Promise<ServiceResponse> {
        try {
            const doc = await this.model.findOne({name: name});
            if (!doc) {
                return new ServiceResponse(404, "PaymentsTypes not found", "", null);
            }
            return new ServiceResponse(200, "Ok", "", doc);
        } catch (error) {

            this._logger.error(`PaymentsTypes: Error no controlado findByName ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);

        }
    }

}