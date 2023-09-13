import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoggerService } from "src/common/logger/logger.service";
import { ServiceResponse } from "src/common/utils/services-response";
import { DocumentsTypes } from "src/models/documents-types.model";

@Injectable()
export class DocumentsTypesService {
    constructor(
        @InjectModel('DocumentsTypes') private readonly model: Model<DocumentsTypes>,
        private readonly _logger: LoggerService
    ) { }
    async findAll(): Promise<ServiceResponse> {
        try {
            const list = await this.model.find().exec();
            return new ServiceResponse(200, "Ok", "", list);
        } catch (error) {
            this._logger.error(`DocumentsTypes: Error no controlado findAll ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }
}