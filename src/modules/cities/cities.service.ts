import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoggerService } from "src/common/logger/logger.service";
import { ServiceResponse } from "src/common/utils/services-response";
import { Cities } from "src/models/cities.model";

@Injectable()
export class CitiesService {

    constructor(
        @InjectModel('Cities') private readonly cityModel: Model<Cities>,
        private readonly _logger: LoggerService

    ) { }

    async getCitiesByCountry(countryId: string): Promise<ServiceResponse> {
        try {
            const list = await this.cityModel.find({ country: countryId }).exec();
            return new ServiceResponse(200, "Ok", "", list);
        } catch (error) {
            this._logger.error(`Cities: Error no controlado getCitiesByCountry ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }

    }

    async findAll(): Promise<Cities[]> {
        return this.cityModel.find().exec();
    }
}