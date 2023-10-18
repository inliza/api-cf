import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoggerService } from "src/common/logger/logger.service";
import { ServiceResponse } from "src/common/utils/services-response";
import { ClientsCreateDto } from "src/dto/clients-create.dto";
import { Clients } from "src/models/clients.model";
import { DocumentsTypes } from "src/models/documents-types.model";
import { UsersService } from "../users/users.service";
import { UserStatusService } from "../user-status/user-status.service";
import { DocumentsTypesService } from "../documents-types/documents-types.service";
import { UserTypesService } from "../user-types/user-types.service";
import { NotificationsService } from "../notifications/notifications.service";
import { ConfirmationCodesService } from "../confirmation-codes/confirmation-codes.service";
import { ClientsUpdateDto } from "src/dto/clients-update.dto";
import { GenderService } from "../gender/gender.service";

@Injectable()
export class ClientsService {
    constructor(
        private readonly _users: UsersService,
        private readonly _userStatus: UserStatusService,
        private readonly _documentType: DocumentsTypesService,
        private readonly _usersTypes: UserTypesService,
        private readonly _notifications: NotificationsService,
        private readonly _codes: ConfirmationCodesService,
        private readonly _gender: GenderService,
        @InjectModel('Clients') private readonly model: Model<Clients>,
        private readonly _logger: LoggerService
    ) { }

    async findAll(): Promise<ServiceResponse> {
        try {
            const list = await this.model.find().exec();
            return new ServiceResponse(200, "Ok", "", list);
        } catch (error) {
            this._logger.error(`Clients: Error no controlado findAll ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async findByUserId(userId: string): Promise<ServiceResponse> {
        try {
            const comp = await this.model.findOne({ user: userId }).populate('userStatus')
                .exec();
            if (!comp) {
                this._logger.error(`Clients: No se han encontrado companies con el userId especificado ${userId}`);
                return new ServiceResponse(404, "Client not found", "", null);
            }
            return new ServiceResponse(200, "Ok", "", comp);
        } catch (error) {
            this._logger.error(`Clients: Error no controlado findByUserId ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async create(request: ClientsCreateDto): Promise<ServiceResponse> {
        try {
            const errorMessage = "Ha ocurrido un error creando su usuario, por favor intente mas adelante."
            const user = await this._users.findByEmail(request.email);
            if (user.statusCode !== 404) {
                return new ServiceResponse(400, "", user.statusCode === 200 ? "Este correo ya está registrado." : errorMessage, null);
            }

            const userStatus = await this._userStatus.findByName('Pending');
            if (userStatus.statusCode !== 200) {
                return new ServiceResponse(400, "", userStatus.statusCode === 404 ? "Error en configuracion. userStatus" : errorMessage, null);
            }

            const userType = await this._usersTypes.findByName('Client');
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

            const record = new this.model({
                user: savedUser.object._id,
                userStatus: userStatus.object._id,
                firstName: request.firstName,
                lastName: request.lastName,
                phone: request.phone
            })

            await record.save();

            const generateCode = await this._codes.create(savedUser.object.id, 'Client', 3);
            if (generateCode.statusCode === 200) {
                await this.sendCreateClientEmail({ email: request.email, name: request.firstName, code: generateCode.object });
            }

            return new ServiceResponse(200, "Ok", "", {
                firstName: request.firstName,
                email: request.email,
                _id: record._id,
                status: userStatus.object.name
            });

        } catch (error) {
            this._logger.error(`Clients: Error no controlado createCompany ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    private async sendCreateClientEmail(data: any): Promise<ServiceResponse> {
        try {
            const payload = {
                name: data.name,
                verificationCode: data.code,
                email: data.email,
            }

            const send = await this._notifications.send('mail/client/verification', payload);
            if (send.statusCode !== 200) {
                this._logger.error(`ERROR: No se pudo enviar la solicitud a ${payload.email}. ${JSON.stringify(payload)}`);
            }
            return send;
        } catch (error) {
            this._logger.error(`Clients: Error no controlado sendCreateClientEmail ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);

        }

    }

    async put(payload: ClientsUpdateDto, id: string): Promise<ServiceResponse> {
        try {
            if(payload.gender){
                const gender = await this._gender.findById(payload.gender);
                if (gender.statusCode !== 200) {
                    return new ServiceResponse(400, "", gender.statusCode === 404 ? "Este sexo no existe." : "Ha ocurrido un error", null);
                }
            }

            if(payload.documentType){
                const doc = await this._documentType.findById(payload.documentType);
                if (doc.statusCode !== 200) {
                    return new ServiceResponse(400, "", doc.statusCode === 404 ? "Este tipo de documento no existe." : "Ha ocurrido un error", null);
                }
            }
           

            const client = await this.model.findByIdAndUpdate(
                id,
                this.clean(payload)
            );

            if (!client) {
                return new ServiceResponse(404,
                    "Error",
                    "The client with the given ID was not found.",
                    id)
            }

            return new ServiceResponse(200, "Ok", "", null);
        } catch (error) {
            this._logger.error(`Clients: Error no controlado put ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async checkCode(code: string): Promise<ServiceResponse> {
        return this._codes.check(code, "Client");
    }

    async confirmateAccount(code: string): Promise<ServiceResponse> {
        try {

            const check = await this._codes.getOne(code);
            if (check.statusCode !== 200) {
                return new ServiceResponse(400, "Error", "Código expirado o ya usado", null);
            }

            const userStatus = await this._userStatus.findByName('Active');
            if (userStatus.statusCode !== 200) {
                return new ServiceResponse(400, "", userStatus.statusCode === 404 ? "Error en configuracion. userStatus" : "Ha ocurrido un error inesperado", null);
            }

            const user = await this._users.findById(check.object.user);
            if (user.statusCode !== 200) {
                return new ServiceResponse(404,
                    "Error",
                    "Usuario no encontrado, favor comuníquese con soporte técnico",
                    null);
            }

            const cli = await this.findByUserId(user.object.id);
            if (cli.statusCode !== 200) {
                return new ServiceResponse(404, "Informacion", "No pudimos encontrar una cuenta asociada con este correo", null);
            }

            const client = await this.model.findByIdAndUpdate(cli.object.id, {
                userStatus: userStatus.object.id,
            });

            if (client) {
                await this._codes.changeStatus(check.object.id);
                return new ServiceResponse(200, "Ok", "Su cuenta ha sido activada", null);
            } else {
                return new ServiceResponse(400, "Informacion", "No se ha podido activar su cuenta en estos momentos", null);
            }

        } catch (error) {
            this._logger.error(`Companies: Error no controlado forgotPassowrd ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async forgotPassword(email: string): Promise<ServiceResponse> {
        try {
            const user = await this._users.findByEmail(email);
            if (user.statusCode !== 200) {
                return new ServiceResponse(404, "Informacion", "No pudimos encontrar una cuenta asociada con este correo", null);
            }

            const client = await this.findByUserId(user.object.id);
            if (client.statusCode !== 200) {
                return new ServiceResponse(404, "Informacion", "No pudimos encontrar una cuenta asociada con este correo", null);
            }
            const generateCode = await this._codes.create(user.object.id, 'Client', 1);
            if (generateCode.statusCode !== 200) {
                return new ServiceResponse(400, "Informacion", "No pudimos completar tu solicitud en estos momentos.", null);
            }

            const res = await this._notifications.send('mail/client/resetPassword', { email: email, name: client.object.firstName, resetPasswordCode: generateCode.object });
            if (res.statusCode !== 200) {
                return new ServiceResponse(400, "Informacion", "No pudimos completar tu solicitud en estos momentos.", null);
            }

            return new ServiceResponse(200, "Ok", "Su correo de recuperación ha sido enviado correctamente", null);

        } catch (error) {
            this._logger.error(`Clients: Error no controlado forgotPassowrd ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async getById(id: string): Promise<ServiceResponse> {
        try {
            const c = await this.model.findById(id).populate(
                "user",
                "email -_id"
              );;
            if (!c) {
                this._logger.error(`Clients: No se han encontrado el cliente con el id especificado ${id}`);
                return new ServiceResponse(404, "Client not found", "", null);
            }
            return new ServiceResponse(200, "Ok", "", c);
        } catch (error) {
            this._logger.error(`Companies: Error no controlado getById ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async getLogged(id: string): Promise<ServiceResponse> {
        try {
            const c = await this.model.findById(id, {
                createdDate: 0,
                deleted: 0,
                userStatus: 0,
              })
                .populate("user", "email -_id")
                .populate("documentType", "name _id")
                .populate("gender", "name _id");
            if (!c) {
                this._logger.error(`Clients: No se han encontrado el cliente con el id especificado ${id}`);
                return new ServiceResponse(404, "Client not found", "", null);
            }
            return new ServiceResponse(200, "Ok", "", c);
        } catch (error) {
            this._logger.error(`Companies: Error no controlado getLogged ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }


    private clean(obj) {
        for (var propName in obj) {
            if (
                obj[propName] === null ||
                obj[propName] === undefined ||
                obj[propName] === ""
            ) {
                delete obj[propName];
            }
        }
        return obj;
    }
}