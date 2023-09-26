import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoggerService } from "src/common/logger/logger.service";
import { ServiceResponse } from "src/common/utils/services-response";
import { ConfirmationCodes } from "src/models/confirmation-codes.model";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ConfirmationCodesService {

    constructor(
        @InjectModel('ConfirmationCodes') private readonly model: Model<ConfirmationCodes>,
        private readonly _logger: LoggerService
    ) { }


    async create(userId: string, type: string): Promise<ServiceResponse> {
        try {
            const code = uuidv4();
            const date = new Date();

            const confirmation = new this.model({
                user: userId,
                code: code,
                type: type,
                expireDate: date.setDate(date.getDate() + 1),
            });

            await confirmation.save();
            this._logger.info(`ConfirmationCodesService: Codigo registrado correctamente: ${userId}`);
            return new ServiceResponse(200, "Success", "User Created", code);
        } catch (error) {
            this._logger.error(`ConfirmationCodesService: Error no controlado create ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }

    }

    async check(code: string): Promise<ServiceResponse> {
        try {
            const date = new Date();
            const verCode = await this.model.findOne({
                code: code,
                validated: false,
                expireDate: {
                    $gte: date.toISOString(),
                },
            });
            if (!verCode) {
                return new ServiceResponse(400, "Error", "Enlance no disponible", null);
            }
            return new ServiceResponse(200, "Ok", "Enlance validado", null);

        } catch (error) {
            this._logger.error(`ConfirmationCodesService: Error no controlado check ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }

    }

    async changeStatus(id: string): Promise<void> {
        try {
            await this.model.findByIdAndUpdate(id, {
                validated: true,
            });
        } catch (error) {
            this._logger.error(`ConfirmationCodesService: Error no controlado changeStatus ${error}`);

        }
    }

    async getOne(code: string): Promise<ServiceResponse> {
        try {
            const date = new Date();
            const verCode = await this.model.findOne({
                code: code,
                validated: false,
                expireDate: {
                    $gte: date.toISOString(),
                },
            });
            if (!verCode) {
                return new ServiceResponse(400, "Error", "Enlance no disponible", null);
            }
            return new ServiceResponse(200, "Ok", "Enlance validado", verCode);

        } catch (error) {
            this._logger.error(`ConfirmationCodesService: Error no controlado getOne ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

}