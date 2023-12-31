import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { LoggerService } from "src/common/logger/logger.service";
import { ServiceResponse } from "src/common/utils/services-response";
import { VehicleRentCar } from "src/models/vehicles-rent-cars.model";
import { VehiclesStatusService } from "../vehicles-status/vehicles-status.service";
import { VehiclesAvailablesDto } from "src/dto/vehicles-available.dto";
import { CompaniesPickupsService } from "../companies-pickups/companies-pickups.service";
import { BookingsService } from "../bookings/bookings.service";
import { VehiclesChangeStatusDto } from "src/dto/vehicles-change-status.dto";
import { CreateVehicleDto } from "src/dto/vehicles-create.dto";
import { MakesService } from "../makes/makes.service";
import { ModelsService } from "../models/models.service";
import { VehiclesFuelService } from "../vehicles-fuel/vehicles-fuel.service";
import { VehiclesTypesService } from "../vehicles-types/vehicles-types.service";
import { VehiclesImagesService } from "../vehicle-images/vehicle-images.service";
import { UpdateVehicleDto } from "src/dto/vehicles-update.dto";

@Injectable()
export class VehiclesRentCarsService {

    constructor(
        @InjectModel('VehicleRentCar') private readonly model: Model<VehicleRentCar>,
        private readonly _logger: LoggerService,
        private readonly _status: VehiclesStatusService,
        private readonly _pickups: CompaniesPickupsService,
        private readonly _bookings: BookingsService,
        private readonly _make: MakesService,
        private readonly _models: ModelsService,
        private readonly _fuel: VehiclesFuelService,
        private readonly _types: VehiclesTypesService,
        private readonly _images: VehiclesImagesService
    ) { }


    async getByCompany(company: string): Promise<ServiceResponse> {
        try {
            const vehicles = await this.model.find(
                { companyId: company, deleted: false },
                { companyId: 0, deleted: 0 }
            )
                .populate("make", "name -_id")
                .populate("vehiclesFuel", "name -_id")
                .populate("vehiclesTypes", "name -_id")
                .populate("vehiclesStatus", "name -_id");

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

            const vehicle = await this.model.findOne({
                _id: vehicleId,
                deleted: false,
                vehiclesStatus: validateStatus.object.id,
            })
                .populate("vehiclesFuel")
                .populate("vehiclesTypes");
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
                    vehiclesStatus: validateStatus.object.id,
                    deleted: false,
                    companyId: { $in: companiesByPickup.object.companies },
                    _id: { $nin: notAvailableList.object },
                },
                { deleted: 0 }
            )
                .populate("vehiclesFuel", "name -_id")
                .populate("vehiclesTypes", "name -_id");

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
                        _id: { $nin: notAvailableList.object },
                        vehiclesStatus: validateStatus.object._id,
                    },
                },
                { $sample: { size: 8 } },
                {
                    $lookup: {
                        from: 'vehiclestypes',
                        localField: 'vehiclesTypes',
                        foreignField: '_id',
                        as: 'vehiclesTypes',
                    },
                },
                {
                    $lookup: {
                        from: 'vehiclesfuels',
                        localField: 'vehiclesFuel',
                        foreignField: '_id',
                        as: 'vehiclesFuel',
                    },
                },
                {
                    $group: {
                        _id: '$_id',
                        result: { $push: '$$ROOT' },
                    },
                },
                {
                    $unwind: '$result',
                },
                {
                    $replaceRoot: {
                        newRoot: '$result',
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
            const validateStatus = await this._status.findById(payload.statusId);
            if (validateStatus.statusCode !== 200) {
                return new ServiceResponse(400, "Error", "Este Status no existe", null);
            }
            const update = await this.model.findByIdAndUpdate(payload.vehicleId,
                {
                    vehiclesStatus: validateStatus.object.id,
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

    async create(payload: CreateVehicleDto, companyId: string): Promise<ServiceResponse> {
        try {

            const make = await this._make.findById(payload.makeId);
            if (make.statusCode !== 200) {
                return make;
            }
            const model = await this._models.findById(payload.modelId);
            if (model.statusCode !== 200) {
                return model;
            }
            const fuelType = await this._fuel.findById(payload.fuelTypeId);
            if (fuelType.statusCode !== 200) {
                return fuelType;
            }
            const validateStatus = await this._status.findByName("Disponible");
            if (validateStatus.statusCode !== 200) {
                return new ServiceResponse(400, "Error", "Status are not defined", null);
            }
            const type = await this._types.findById(payload.vehicleTypeId);
            if (type.statusCode !== 200) {
                return type;
            }
            const payloadImages = payload.images.map((obj) => obj.FileImage);

            const images = await this._images.uploadImages(payloadImages);
            if (images.statusCode !== 200) {
                return new ServiceResponse(400, "Error", "Ha ocurrido un error guardando el vehículo.", payload);
            }
            let vehicle = new this.model({
                make: {
                    _id: make.object.id,
                    name: make.object.name,
                },
                model: {
                    _id: model.object.id,
                    name: model.object.name,
                },
                companyId: companyId,
                year: payload.year,
                priceByDay: payload.priceByDay,
                vehiclesTypes: type.object.id,
                vehiclesFuel: fuelType.object.id,
                vehiclesStatus: validateStatus.object.id,
                coinType: payload.coinType,
                placa: payload.placa,
                images: images.object,
            });
            await vehicle.save();

            return new ServiceResponse(200, "", "", vehicle);
        }
        catch (error) {
            this._logger.error(`VehiclesRentCars: Error no controlado getAvailable ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async update(payload: UpdateVehicleDto): Promise<ServiceResponse> {
        try {
            const vehic = await this.model.findById(payload._id).exec();

            if (!vehic) {
                return new ServiceResponse(400, "Error", "Este vehículo no existe", null);
            }

            const make = await this.fetchItemById(payload.makeId, this._make);
            const model = await this.fetchItemById(payload.modelId, this._models);
            const fuelType = await this.fetchItemById(payload.fuelTypeId, this._fuel);
            const type = await this.fetchItemById(payload.vehicleTypeId, this._types);
            const [imgs, imgsToDelete, imgsToDeleteIds] = this.processImages(payload.images, vehic.images);

            const images = await this._images.uploadImages(imgs.map(x => x.FileImage));

            if (images.statusCode !== 200) {
                return new ServiceResponse(400, "Error", "Ha ocurrido un error guardando el vehículo.", payload);
            }

            const objToUpdate = {
                make: {
                    _id: make.object.id,
                    name: make.object.name,
                },
                model: {
                    _id: model.object.id,
                    name: model.object.name,
                },
                year: payload.year,
                priceByDay: payload.priceByDay,
                vehiclesTypes: type.object.id,
                vehiclesFuel: fuelType.object.id,
                coinType: payload.coinType,
                placa: payload.placa,
            };

            if (imgs.length > 0) {
                objToUpdate['$push'] = { images: { $each: images.object } };
            }

            const update = await this.model.findByIdAndUpdate(payload._id, objToUpdate);

            if (imgsToDelete.length > 0) {
                const payloadId = new mongoose.Types.ObjectId(payload._id);
                const deleteResult = await this._images.deleteImages(imgsToDelete);
                if (deleteResult.statusCode === 200) {
                    for (const imgId of imgsToDeleteIds) {
                        await this.model.findByIdAndUpdate(payloadId, {
                            $pull: {
                                images: { _id: new mongoose.Types.ObjectId(imgId) },
                            },
                        });
                    }
                }
            }

            return new ServiceResponse(200, "", "", update);
        } catch (error) {
            this._logger.error(`VehiclesRentCars: Error no controlado update ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    private async fetchItemById(id: string, service: any): Promise<ServiceResponse> {
        const item = await service.findById(id);
        if (!item || item.statusCode !== 200) {
            throw new Error(`Error fetching item with id ${id}`);
        }
        return item;
    }

    private processImages(newImages: any[], existingImages: any[]): [any[], any[], any[]] {
        const imgs = newImages.filter(item => item && item.FileName);
        const imgsToDelete = existingImages
            .filter(item => item && !newImages.some(newImage => newImage && newImage.publicId === item.publicId))
            .map(item => [item.publicId, item.publicIdThumbnail])
            .flat();
        const imgsToDeleteIds = existingImages
            .filter(item => item && !newImages.some(newImage => newImage && newImage.publicId === item.publicId))
            .map(item => item.id);
        return [imgs, imgsToDelete, imgsToDeleteIds];
    }





}