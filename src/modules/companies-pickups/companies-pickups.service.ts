import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoggerService } from "src/common/logger/logger.service";
import { ServiceResponse } from "src/common/utils/services-response";
import { CitiesPickUp } from "src/models/cities-pickup.model";
import { Cities } from "src/models/cities.model";
import { CompaniesPickups } from "src/models/companies-pickup.model";

@Injectable()
export class CompaniesPickupsService {
    constructor(
        @InjectModel('CompaniesPickups') private readonly model: Model<CompaniesPickups>,
        @InjectModel('CitiesPickUp') private readonly citiesPickupModel: Model<CitiesPickUp>,
        @InjectModel('Cities') private readonly cityModel: Model<Cities>,


        private readonly _logger: LoggerService
    ) { }


    async getCompaniesByPickup(pickupId: string): Promise<ServiceResponse> {

        try {
            const companies = await this.model.find({
                citypickupId: pickupId,
            }).select('companyId -_id');
            const companyIds = companies.map(c => c.companyId);
            return new ServiceResponse(200, "", "", { companies: companyIds })
        } catch (error) {
            this._logger.error(`CompaniesPickups: Error no controlado getCompaniesByPickup ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }


    }

    async getPickupsByCompany(companyId: string): Promise<ServiceResponse> {
        try {

            const companies = await this.model.find({
                companyId,
            }).populate({
                path: 'citypickupId',
                model: 'CitiesPickUp',
                select: 'name _id',
            });

            const cityPickups = companies.map(c => c.citypickupId);
            return new ServiceResponse(200, "", "", cityPickups);
        } catch (error) {
            this._logger.error(`CompaniesPickups: Error no controlado getPickupsByCompany ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async savePickups(reqBody: any, companyId: string): Promise<ServiceResponse> {
        try {
            if (!Array.isArray(reqBody)) {
                return new ServiceResponse(400, "Error", "Payload not valid", null);
            }

            const companyData = await this.model.find({
                companyId,
            });

            const promises = [];

            for (const pickup of reqBody) {
                for (const site of pickup.sites) {
                    const existingPickup = companyData.find((x) => x.citypickupId == site._id);

                    if (site.marked) {
                        if (!existingPickup) {
                            const comPickup = new CompaniesPickups({
                                companyId,
                                citypickupId: site._id,
                                cityId: pickup.city,
                            });

                            promises.push(comPickup.save());
                            console.log(`Lugar guardado ciudad de ${pickup.name}`);
                        }
                    } else if (existingPickup) {
                        promises.push(this.model.findByIdAndDelete(existingPickup._id));
                    }
                }
            }

            await Promise.all(promises);
            return new ServiceResponse(200, "Ok", "Puntos de entrega guardados", null);

        } catch (error) {
            this._logger.error(`CompaniesPickups: Error no controlado savePickups ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }

    }

    async getAllPickups(companyId: string): Promise<ServiceResponse> {
        try {
            const cities = await this.cityModel.find().select('-country');
            const citiesPickups = [];

            for (const city of cities) {
                const sites = await this.citiesPickupModel
                    .find({ city: city._id })
                    .select('-city')
                    .lean();

                const siteIds = sites.map((site) => site._id);

                const markedSites = await this.model
                    .find({ companyId, citypickupId: { $in: siteIds } })
                    .distinct('citypickupId');

                const isAllMarked = markedSites.length === siteIds.length;

                citiesPickups.push({
                    city: city._id,
                    name: city.name,
                    sites: sites.map((site) => ({
                        ...site,
                        marked: markedSites.includes(site._id),
                    })),
                    all: isAllMarked,
                });
            }

            return new ServiceResponse(200, "Ok", "", citiesPickups);
        } catch (error) {
            this._logger.error(`CompaniesPickups: Error no controlado getAllPickups ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }

    }

}