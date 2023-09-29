import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoggerService } from "src/common/logger/logger.service";
import { ServiceResponse } from "src/common/utils/services-response";
import { VehiclesTypes } from "src/models/vehicles-types.model";

@Injectable()
export class VehiclesTypesService {

    constructor(
        @InjectModel('VehiclesTypes') private readonly model: Model<VehiclesTypes>,
        private readonly _logger: LoggerService

    ) { }


    async findAll(): Promise<ServiceResponse> {
        try {
            const list = await this.model.find().exec();
            return new ServiceResponse(200, "Ok", "", list);
        } catch (error) {
            this._logger.error(`VehiclesTypes: Error no controlado findAll ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }
}