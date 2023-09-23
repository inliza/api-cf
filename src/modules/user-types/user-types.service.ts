import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoggerService } from "src/common/logger/logger.service";
import { ServiceResponse } from "src/common/utils/services-response";
import { UserTypes } from "src/models/user-types.model";

@Injectable()
export class UserTypesService {
    constructor(
        @InjectModel('UserTypes') private readonly model: Model<UserTypes>,
        private readonly _logger: LoggerService
    ) { }
    async findAll(): Promise<ServiceResponse> {
        try {
            const list = await this.model.find().exec();
            return new ServiceResponse(200, "Ok", "", list);
        } catch (error) {
            this._logger.error(`UserTypes: Error no controlado findAll ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async findById(id: string) {
        try {
            const types = await this.model.findById(id);
            if (!types) {
                return new ServiceResponse(404, "Users Types not found", "", null);
            }
            return new ServiceResponse(200, "Ok", "", types);
        } catch (error) {

            this._logger.error(`UsersTypes: Error no controlado findById ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);

        }
    }

    async findByName(name: string) {
        try {
            const type = await this.model.findOne({name: name});
            if (!type) {
                return new ServiceResponse(404, "User Type not found", "", null);
            }
            return new ServiceResponse(200, "Ok", "", type);
        } catch (error) {

            this._logger.error(`UsersTypes: Error no controlado findByName ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);

        }
    }
}