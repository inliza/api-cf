import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoggerService } from "src/common/logger/logger.service";
import { ServiceResponse } from "src/common/utils/services-response";
import { Makes } from "src/models/makes.model";

@Injectable()
export class MakesService {

    constructor(
        @InjectModel('Makes') private readonly model: Model<Makes>,
        private readonly _logger: LoggerService

    ) { }

    async findAll(): Promise<ServiceResponse> {
        try {
            const list = await this.model.find().exec();
            return new ServiceResponse(200, "Ok", "", list);
        } catch (error) {
            this._logger.error(`Makes: Error no controlado findAll ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async findById(id:string){
        try {
            const make = await this.model.findById(id);
            if (!make) {
                return new ServiceResponse(404, "Make not found", "", null);
            }
            return new ServiceResponse(200, "Ok", "", make);
        } catch (error) {

            this._logger.error(`Cities: Error no controlado findById ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);

        }
    }



}