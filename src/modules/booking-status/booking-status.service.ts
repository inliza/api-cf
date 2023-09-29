import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoggerService } from "src/common/logger/logger.service";
import { ServiceResponse } from "src/common/utils/services-response";
import { BookingStatus } from "src/models/bookings-status.model";

@Injectable()
export class BookingStatusService {

    constructor(
        @InjectModel('BookingStatus') private readonly model: Model<BookingStatus>,
        private readonly _logger: LoggerService

    ) { }

    async findAll(): Promise<ServiceResponse> {
        try {
            const list = await this.model.find().exec();
            return new ServiceResponse(200, "Ok", "", list);
        } catch (error) {
            this._logger.error(`BookingStatus: Error no controlado findAll ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async findByName(name: string) {
        try {
            const status = await this.model.findOne({ name: name }).exec();
            if (!status) {
                return new ServiceResponse(404, "BookingStatus not found", "", null);
            }
            return new ServiceResponse(200, "Ok", "", status);
        } catch (error) {
            this._logger.error(`BookingStatus: Error no controlado findByName ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }


}