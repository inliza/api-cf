import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoggerService } from "src/common/logger/logger.service";
import { ServiceResponse } from "src/common/utils/services-response";
import { Models } from "src/models/models.model";

@Injectable()
export class ModelsService {

    constructor(
        @InjectModel('Models') private readonly model: Model<Models>,
        private readonly _logger: LoggerService

    ) { }

    async findById(id:string): Promise<ServiceResponse>{
        try {
            const models = await this.model.findById(id);
            if (!models) {
                return new ServiceResponse(404, "Models not found", "", null);
            }
            return new ServiceResponse(200, "Ok", "", models);
        } catch (error) {

            this._logger.error(`Models: Error no controlado findById ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);

        }
    }

    async getByMake(make:string): Promise<ServiceResponse>{
        try {
            const models = await this.model.find({make: make});
            return new ServiceResponse(200, "Ok", "", models);

        } catch (error) {
            this._logger.error(`Models: Error no controlado getByMake ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);

        }
    }


}