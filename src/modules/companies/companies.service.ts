import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ServiceResponse } from 'src/common/utils/services-response';
import { CompanyCreateDto } from 'src/dto/companies-create.dto';
import { CitiesService } from '../cities/cities.service';
import { UserStatusService } from '../user-status/user-status.service';
import { DocumentsTypesService } from '../documents-types/documents-types.service';
import { UserTypesService } from '../user-types/user-types.service';
import { InjectModel } from '@nestjs/mongoose';
import { Companies } from 'src/models/companies.model';
import { Model } from 'mongoose';
import { LoggerService } from 'src/common/logger/logger.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CompanyUpdateDto } from 'src/dto/companies-update.dto';
import { ConfirmationCodesService } from '../confirmation-codes/confirmation-codes.service';

@Injectable()
export class CompaniesService {
    constructor(
        private readonly _users: UsersService,
        private readonly _cities: CitiesService,
        private readonly _userStatus: UserStatusService,
        private readonly _documentType: DocumentsTypesService,
        private readonly _usersTypes: UserTypesService,
        @InjectModel('Companies') private readonly model: Model<Companies>,
        private readonly _logger: LoggerService,
        private readonly _notifications: NotificationsService,
        private readonly _codes: ConfirmationCodesService
    ) {
    }


    async createCompany(request: CompanyCreateDto): Promise<ServiceResponse> {
        try {
            const errorMessage = "Ha ocurrido un error creando su usuario, por favor intente mas adelante."
            const user = await this._users.findByEmail(request.email);
            if (user.statusCode !== 404) {
                return new ServiceResponse(400, "", user.statusCode === 200 ? "Este correo ya está registrado." : errorMessage, null);
            }

            const city = await this._cities.findById(request.city);
            if (city.statusCode !== 200) {
                return new ServiceResponse(400, "", city.statusCode === 404 ? "Esta ciudad no existe." : errorMessage, null);
            }

            const doc = await this._documentType.findByName('Cedula');
            if (doc.statusCode !== 200) {
                return new ServiceResponse(400, "", doc.statusCode === 404 ? "Error en configuracion. DocType" : errorMessage, null);
            }

            const userStatus = await this._userStatus.findByName('Pending');
            if (userStatus.statusCode !== 200) {
                return new ServiceResponse(400, "", userStatus.statusCode === 404 ? "Error en configuracion. userStatus" : errorMessage, null);
            }

            const userType = await this._usersTypes.findByName('Rent Car');
            if (userType.statusCode !== 200) {
                return new ServiceResponse(400, "", userType.statusCode === 404 ? "Error en configuracion. userType" : errorMessage, null);
            }

            const savedUser = await this._users.registerUser({
                email: request.email,
                password: request.password,
                userType: userType.object.id
            });

            if (savedUser.statusCode !== 200) {
                return savedUser;
            }

            const company = new this.model({
                user: savedUser.object._id,
                userStatus: userStatus.object._id,
                city: city.object._id,
                documentType: doc.object._id,
                document: request.document,
                name: request.name,
                rnc: request.rnc,
                address: request.address,
                ownerName: request.ownerName,
                phoneNumber: request.phoneNumber,
                mobileNumber: request.mobileNumber
            })

            await company.save();

            await this.sendCreateCompanyEmail({ ...request, city: city.object.name });

            return new ServiceResponse(200, "Ok", "", {
                name: request.name,
                email: request.email,
                _id: company._id,
                status: userStatus.object.name
            });

        } catch (error) {
            this._logger.error(`Companies: Error no controlado createCompany ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async findByUserId(userId: string): Promise<ServiceResponse> {
        try {
            const comp = await this.model.findOne({ user: userId }).populate('userStatus')
                .exec();
            if (!comp) {
                this._logger.error(`Companies: No se han encontrado companies con el userId especificado ${userId}`);
                return new ServiceResponse(404, "Company not found", "", null);
            }
            return new ServiceResponse(200, "Ok", "", comp);
        } catch (error) {
            this._logger.error(`Companies: Error no controlado findByUserId ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async getById(id: string): Promise<ServiceResponse> {
        try {
            const comp = await this.model.findById(id);
            if (!comp) {
                this._logger.error(`Companies: No se han encontrado companies con el id especificado ${id}`);
                return new ServiceResponse(404, "Company not found", "", null);
            }
            return new ServiceResponse(200, "Ok", "", { name: comp.name, address: comp.address, phoneNumber: comp.phoneNumber });
        } catch (error) {
            this._logger.error(`Companies: Error no controlado getById ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async getLoggedInfo(id: string): Promise<ServiceResponse> {
        try {
            const comp = await this.model.findById(id, {
                createDate: 0,
                deleted: 0,
                userStatus: 0,
            }).populate("user", "email -_id")
                .populate({
                    path: "city",
                    model: "Cities",
                    populate: { path: "country", model: "Countries" },
                }).exec();

            if (!comp) {
                this._logger.error(`Companies: No se han encontrado companies con el id especificado ${id}`);
                return new ServiceResponse(404, "Company not found", "", null);
            }
            return new ServiceResponse(200, "Ok", "", comp);
        } catch (error) {
            this._logger.error(`Companies: Error no controlado getLoggedInfo ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async getAll(): Promise<ServiceResponse> {
        try {
            const comp = await this.model.find()
                .populate("user", "email -_id")
                .populate("city", "name -_id").exec();

            return new ServiceResponse(200, "Ok", "", comp);
        } catch (error) {
            this._logger.error(`Companies: Error no controlado getById ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    private async sendCreateCompanyEmail(data: any): Promise<ServiceResponse> {
        try {
            const payload = {
                name: data.name,
                address: data.address,
                email: data.email,
                ownerName: data.ownerName,
                rnc: data.rnc,
                document: data.document,
                phoneNumber: data.phoneNumber,
                mobileNumber: data.mobileNumber,
                city: data.city,
                emailCF: process.env.EMAIL_SOPORTE
            }

            const send = await this._notifications.send('mail/company/new-account', payload);
            if (send.statusCode !== 200) {
                this._logger.error(`ERROR: No se pudo enviar la solicitud a ${payload.email}. ${JSON.stringify(payload)}`);
            }
            return send;
        } catch (error) {
            this._logger.error(`Companies: Error no controlado sendCreateCompanyEmail ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);

        }

    }

    async put(payload: CompanyUpdateDto, id: string): Promise<ServiceResponse> {
        try {
            const city = await this._cities.findById(payload.city);
            if (city.statusCode !== 200) {
                return new ServiceResponse(400, "", city.statusCode === 404 ? "Esta ciudad no existe." : "Ha ocurrido un error", null);
            }

            const company = await this.model.findByIdAndUpdate(
                id,
                {
                    name: payload.name,
                    ownerName: payload.ownerName,
                    document: payload.document,
                    address: payload.address,
                    rnc: payload.rnc,
                    mobileNumber: payload.mobileNumber,
                    phoneNumber: payload.phoneNumber,
                    city: payload.city,
                }
            );

            if (!company) {
                return new ServiceResponse(404,
                    "Error",
                    "The company with the given ID was not found.",
                    id)
            }

            return new ServiceResponse(200, "Ok", "", null);
        } catch (error) {
            this._logger.error(`Companies: Error no controlado getById ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async forgotPassword(email: string): Promise<ServiceResponse> {
        try {
            const user = await this._users.findByEmail(email);
            if (user.statusCode !== 200) {
                return new ServiceResponse(404, "Informacion", "No pudimos encontrar una cuenta asociada con este correo", null);
            }

            const company = await this.findByUserId(user.object.id);
            if (company.statusCode !== 200) {
                return new ServiceResponse(404, "Informacion", "No pudimos encontrar una cuenta asociada con este correo", null);
            }

            const generateCode = await this._codes.create(user.object.id, 'Company');
            if (generateCode.statusCode !== 200) {
                return new ServiceResponse(400, "Informacion", "No pudimos completar tu solicitud en estos momentos.", null);
            }

            const res = await this._notifications.send('mail/company/resetPassword', { email: email, name: company.object.name, resetPasswordCode: generateCode.object });
            if (res.statusCode !== 200) {
                return new ServiceResponse(400, "Informacion", "No pudimos completar tu solicitud en estos momentos.", null);
            }

            return new ServiceResponse(200, "Ok", "Su correo de recuperación ha sido enviado correctamente", null);

        } catch (error) {
            this._logger.error(`Companies: Error no controlado forgotPassowrd ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async checkCode(code: string): Promise<ServiceResponse> {
        return this._codes.check(code);
    }

    async validateCompany(email: string): Promise<ServiceResponse> {
        try {

            const user = await this._users.findByEmail(email);
            if (user.statusCode !== 200) {
                return new ServiceResponse(404, "Informacion", "No pudimos encontrar una cuenta asociada con este correo", null);
            }

            const company = await this.findByUserId(user.object.id);
            if (company.statusCode !== 200) {
                return new ServiceResponse(404, "Informacion", "No pudimos encontrar una cuenta asociada con este correo", null);
            }

            const userStatus = await this._userStatus.findByName('Active');
            if (userStatus.statusCode !== 200) {
                return new ServiceResponse(400, "", userStatus.statusCode === 404 ? "Error en configuracion. userStatus" : userStatus.message, null);
            }

            if (company.object.userStatus.id == userStatus.object.id) {
                return new ServiceResponse(400, "Informacion", "Su cuenta ya se encuentra activa", null);
            }

            const update = await this.model.findByIdAndUpdate(
                company.object.id,
                {
                    userStatus: userStatus.object.id
                }
            );

            if (!update) {
                return new ServiceResponse(404,
                    "Error",
                    "The company with the given ID was not found.",
                    email)
            }

            return new ServiceResponse(200, "Ok", "Su cuenta ha sido activada", null);

        } catch (error) {
            this._logger.error(`Companies: Error no controlado forgotPassowrd ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }


}