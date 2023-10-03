import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoggerService } from "src/common/logger/logger.service";
import { ServiceResponse } from "src/common/utils/services-response";
import { PaymentsStatus } from "src/models/payments-status.model";

@Injectable()
export class PaymentsStatusService {
    constructor(
        @InjectModel('PaymentsStatus') private readonly model: Model<PaymentsStatus>,
        private readonly _logger: LoggerService
    ) { }

    async findByName(name: string) : Promise<ServiceResponse> {
        try {
            const doc = await this.model.findOne({name: name});
            if (!doc) {
                return new ServiceResponse(404, "PaymentsStatus not found", "", null);
            }
            return new ServiceResponse(200, "Ok", "", doc);
        } catch (error) {

            this._logger.error(`PaymentsStatus: Error no controlado findByName ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);

        }
    }

}