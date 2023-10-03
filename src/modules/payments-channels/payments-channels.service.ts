import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoggerService } from "src/common/logger/logger.service";
import { ServiceResponse } from "src/common/utils/services-response";
import { PaymentsChannel } from "src/models/payments-channels.model";

@Injectable()
export class PaymentsChannelsService {
    constructor(
        @InjectModel('PaymentsChannel') private readonly model: Model<PaymentsChannel>,
        private readonly _logger: LoggerService
    ) { }

    async findByName(name: string) : Promise<ServiceResponse> {
        try {
            const doc = await this.model.findOne({name: name});
            if (!doc) {
                return new ServiceResponse(404, "PaymentsChannels not found", "", null);
            }
            return new ServiceResponse(200, "Ok", "", doc);
        } catch (error) {

            this._logger.error(`PaymentsChannels: Error no controlado findByName ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);

        }
    }

}