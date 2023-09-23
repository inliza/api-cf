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

@Injectable()
export class CompaniesService {
    constructor(
        private readonly _users: UsersService,
        private readonly _cities: CitiesService,
        private readonly _userStatus: UserStatusService,
        private readonly _documentType: DocumentsTypesService,
        private readonly _usersTypes: UserTypesService,
        @InjectModel('Companies') private readonly model: Model<Companies>,
        private readonly _logger: LoggerService

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

            return new ServiceResponse(200, "Ok", "", {
                name: request.name,
                email: request.email,
                _id: company._id,
                status: userStatus.object.name
            });

        } catch (error) {
            this._logger.error(`UserStatus: Error no controlado findByName ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

}