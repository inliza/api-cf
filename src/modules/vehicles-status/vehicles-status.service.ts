import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoggerService } from "src/common/logger/logger.service";
import { ServiceResponse } from "src/common/utils/services-response";
import { VehiclesStatus } from "src/models/vehicles-status.model";

@Injectable()
export class VehiclesStatusService {

    constructor(
        @InjectModel('VehiclesStatus') private readonly model: Model<VehiclesStatus>,
        private readonly _logger: LoggerService

    ) { }


    async findAll(): Promise<ServiceResponse> {
        try {
            const list = await this.model.find().exec();
            return new ServiceResponse(200, "Ok", "", list);
        } catch (error) {
            this._logger.error(`VehiclesStatus: Error no controlado findAll ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async findByName(name: string):Promise<ServiceResponse>  {
        try {
            const status = await this.model.findOne({ name: name }).exec();
            if (!status) {
                return new ServiceResponse(404, "Vehicles status not found", "", null);
            }
            return new ServiceResponse(200, "Ok", "", status);
        } catch (error) {
            this._logger.error(`VehiclesStatus: Error no controlado findByName ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async findById(id: string): Promise<ServiceResponse> {
        try {
            const status = await this.model.findById(id);
            if (!status) {
                return new ServiceResponse(404, "VehiclesStatus not found", "", null);
            }
            return new ServiceResponse(200, "Ok", "", status);
        } catch (error) {

            this._logger.error(`VehiclesStatus: Error no controlado findById ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);

        }

    }

}