import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoggerService } from "src/common/logger/logger.service";
import { ServiceResponse } from "src/common/utils/services-response";
import { CreateCitiesPickUpDto, SearchCitiesPickUpDto } from "src/dto/cities-pickup.dto";
import { CitiesPickUp } from 'src/models/cities-pickup.model';

@Injectable()
export class CitiesPickupService {

    constructor(
        @InjectModel('CitiesPickUp') private readonly model: Model<CitiesPickUp>,
        private readonly _logger: LoggerService

    ) { }

    async getPickUpsByCity(cityId: string): Promise<ServiceResponse> {
        try {
            const res = await this.model.find({ city: cityId }).exec();
            return new ServiceResponse(200, "", "", res);

        } catch (error) {
            this._logger.error(`CitiesPickup: Error no controlado getPickUpsByCity ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async getPickUpById(id: string): Promise<ServiceResponse> {
        try {
            const pickUp = await this.model.findById(id).exec();
            if (!pickUp) {
                return new ServiceResponse(400, "Not found", `CitiesPickUp with ID ${id} not found, res`, null);
            }
            return new ServiceResponse(200, "", "", pickUp);
        } catch (error) {
            this._logger.error(`CitiesPickup: Error no controlado getPickUpById ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async searchPickUps(searchDto: SearchCitiesPickUpDto): Promise<ServiceResponse> {
        try {
            const pickUps = await this.model
                .find({
                    name: { $regex: `.*${searchDto.name}.*`, $options: 'i' },
                })
                .populate('city', 'name _id')
                .exec();
            return new ServiceResponse(200, "", "", pickUps);
        } catch (error) {
            this._logger.error(`CitiesPickup: Error no controlado searchPickUps ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }


    }

    async createPickUp(createDto: CreateCitiesPickUpDto): Promise<ServiceResponse> {
        try {
            const pickUp = new this.model({
                name: createDto.name,
                city: createDto.cityId,
            });
            const res = await pickUp.save();
            return new ServiceResponse(200, "", "", res);
        } catch (error) {
            this._logger.error(`CitiesPickup: Error no controlado createPickUp ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }

    }


}