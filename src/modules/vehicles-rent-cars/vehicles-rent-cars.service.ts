import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoggerService } from "src/common/logger/logger.service";
import { ServiceResponse } from "src/common/utils/services-response";
import { VehicleRentCar } from "src/models/vehicles-rent-cars.model";
import { VehiclesStatusService } from "../vehicles-status/vehicles-status.service";
import { VehiclesAvailablesDto } from "src/dto/vehicles-available.dto";
import { CompaniesPickupsService } from "../companies-pickups/companies-pickups.service";
import { BookingsService } from "../bookings/bookings.service";
import { VehiclesChangeStatusDto } from "src/dto/vehicles-change-status.dto";

@Injectable()
export class VehiclesRentCarsService {

    constructor(
        @InjectModel('VehicleRentCar') private readonly model: Model<VehicleRentCar>,
        private readonly _logger: LoggerService,
        private readonly _status: VehiclesStatusService,
        private readonly _pickups: CompaniesPickupsService,
        private readonly _bookings: BookingsService
    ) { }


    async getByCompany(company: string): Promise<ServiceResponse> {
        try {
            const vehicles = await this.model.find(
                { companyId: company, deleted: false },
                { companyId: 0, deleted: 0 }
            )
                .populate("vehicleFuelType", "name -_id")
                .populate("vehicleType", "name -_id");

            return new ServiceResponse(200, "Ok", "", vehicles);
        } catch (error) {
            this._logger.error(`VehiclesRentCars: Error no controlado getByCompany ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async getProfile(vehicleId: string): Promise<ServiceResponse> {
        try {
            const validateStatus = await this._status.findByName("Disponible");
            if (validateStatus.statusCode !== 200) {
                return new ServiceResponse(400, "Error", "Status are not defined", null);
            }

            const vehicle = await this.model.find({
                _id: vehicleId,
                deleted: false,
                vehicleStatus: validateStatus.object.id,
            })
                .populate("vehicleFuelType", "name")
                .populate("vehicleType", "name");
            return new ServiceResponse(vehicle ? 200 : 404, "", "", vehicle);
        } catch (error) {
            this._logger.error(`VehiclesRentCars: Error no controlado getProfile ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async getAvailable(payload: VehiclesAvailablesDto): Promise<ServiceResponse> {
        try {

            const validateStatus = await this._status.findByName("Disponible");
            if (validateStatus.statusCode !== 200) {
                return new ServiceResponse(400, "Error", "Status are not defined", null);
            }

            const companiesByPickup = await this._pickups.getCompaniesByPickup(payload.pickupId);
            if (companiesByPickup.statusCode !== 200) {
                return new ServiceResponse(400, "Info", "No hay vehiculos disponibles para esta ubicacion", null);
            }

            const notAvailableList = await this._bookings.getBookedVehiclesByDates({ fromDate: payload.fromDate, toDate: payload.toDate });
            if (notAvailableList.statusCode !== 200) {
                return new ServiceResponse(400, "Info", "No hay vehiculos disponibles para esta ubicacion", null);
            }

            const vehicles = await this.model.find(
                {
                    vehicleStatus: validateStatus.object.id,
                    deleted: false,
                    companyId: { $in: companiesByPickup.object.companies },
                    _id: { $nin: notAvailableList.object },
                },
                { deleted: 0 }
            )
                .populate("vehicleFuelType", "name -_id")
                .populate("vehicleType", "name -_id");

            return new ServiceResponse(200, "", "", vehicles);
        }
        catch (error) {
            this._logger.error(`VehiclesRentCars: Error no controlado getAvailable ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async getRecents(): Promise<ServiceResponse> {
        try {
            const validateStatus = await this._status.findByName("Disponible");
            if (validateStatus.statusCode !== 200) {
                return new ServiceResponse(400, "Error", "Status are not defined", null);
            }

            const today = new Date();
            const notAvailableList = await this._bookings.getBookedVehiclesByDates({ fromDate: today, toDate: new Date(today.setDate(today.getDate() + 1)) });
            if (notAvailableList.statusCode !== 200) {
                return new ServiceResponse(400, "Info", "No hay vehiculos disponibles para esta ubicacion", null);
            }

            const vehicles = await this.model.aggregate([
                {
                    $match: {
                        deleted: false,
                        vehicleStatus: validateStatus.object.id,
                        _id: { $nin: notAvailableList.object },
                    },
                },
                {
                    $lookup: {
                        from: "vehiclesfuels",
                        localField: "vehicleFuelType",
                        foreignField: "_id",
                        as: "vehicleFuelType",
                    },
                },
                {
                    $lookup: {
                        from: "vehiclestypes",
                        localField: "vehicleType",
                        foreignField: "_id",
                        as: "vehicleType",
                    },
                },
                { $unwind: "$vehicleType" },
                { $unwind: "$vehicleFuelType" },
                { $sample: { size: 8 } },
                {
                    $group: {
                        _id: "$_id",
                        result: { $push: "$$ROOT" },
                    },
                },
                {
                    $replaceRoot: {
                        newRoot: { $first: "$result" },
                    },
                },
            ]);

            return new ServiceResponse(200, "Ok", "", vehicles);
        } catch (error) {
            this._logger.error(`VehiclesRentCars: Error no controlado getRecents ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async getProfileResumed(vehicleId: string): Promise<ServiceResponse> {
        try {
            const vehicle = await this.model.find({
                _id: vehicleId,
                deleted: false
            }).select("make model images");
            return new ServiceResponse(vehicle ? 200 : 404, "", "", vehicle);
        } catch (error) {
            this._logger.error(`VehiclesRentCars: Error no controlado getProfile ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async changeStatus(payload: VehiclesChangeStatusDto): Promise<ServiceResponse> {
        try {
            const validateStatus = await this._status.findById(payload.vehicleId);
            if (validateStatus.statusCode !== 200) {
                return new ServiceResponse(400, "Error", "Este Status no existe", null);
            }
            const update = await this.model.findByIdAndUpdate(payload.vehicleId,
                {
                    vehicleStatus: validateStatus.object.id,
                }
            );
            if (!update) {
                return new ServiceResponse(404, "Error", "Este vehiculo no existe", payload);
            }
            return new ServiceResponse(200, "Ok", "Estado de vehiculo actualizado correctamente", null);
        } catch (error) {
            this._logger.error(`VehiclesRentCars: Error no controlado changeStatus ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async deleteById(id: string): Promise<ServiceResponse> {
        try {
            const deletd = await this.model.findByIdAndUpdate(id, {
                deleted: true,
            });
            if (!deletd) {
                return new ServiceResponse(404, "Error", "Este vehiculo no existe", id);
            }
            return new ServiceResponse(200, "Ok", "Vehiculo eliminado correctamente", null);
        } catch (error) {
            this._logger.error(`VehiclesRentCars: Error no controlado deleteById ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }

    }





}