import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ServiceResponse } from 'src/common/utils/services-response';
import * as bcrypt from 'bcrypt';
import { CompaniesService } from '../companies/companies.service';
import { UsersLoginDto } from 'src/dto/users-login.dto';
import { TokenService } from 'src/common/helper/token.service';
import { LoggerService } from 'src/common/logger/logger.service';
import { ResetPasswordDto } from 'src/dto/reset-password.dto';
import { ConfirmationCodesService } from '../confirmation-codes/confirmation-codes.service';
import { ChangePasswordDto } from 'src/dto/change-password.dto';
import { ClientsService } from '../clients/clients.service';
import { UserTypesService } from '../user-types/user-types.service';
import { OperationsService } from 'src/common/helper/operations.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly _users: UsersService,
        private readonly _companies: CompaniesService,
        private readonly _tokenService: TokenService,
        private readonly _logger: LoggerService,
        private readonly _codes: ConfirmationCodesService,
        private readonly _clients: ClientsService,
        private readonly _usersTypes: UserTypesService,
        private readonly _operations: OperationsService
    ) { }

    async loginCompany(payload: UsersLoginDto): Promise<ServiceResponse> {
        try {

            const user = await this._users.findByEmail(payload.email);
            if (user.statusCode !== 200) {
                return new ServiceResponse(400, "Error", "Usuario o contraseña incorrectos", null);
            }

            const userType = await this._usersTypes.findByName('Rent Car');
            if (userType.statusCode !== 200) {
                return new ServiceResponse(400, "Error", "No se pudo completar su inicio de sesión", null);
            }

            if (!this._operations.compareMongoDBIds(userType.object.id, user.object.userType)) {
                return new ServiceResponse(400, "Error", "Usted no tiene una cuenta de Rent Car, por favor ir al módulo de clientes para continuar.", null);
            }

            const validPassword = await bcrypt.compare(payload.password, user.object.password);
            if (!validPassword) {
                return new ServiceResponse(400, "Error", "Usuario o contraseña incorrectos", null);
            }

            const company = await this._companies.findByUserId(user.object.id);
            if (company.statusCode !== 200) {

                return new ServiceResponse(400, "Error", "No se pudo completar su inicio de sesión", null);
            }

            if (company.object.userStatus.name === "Pending") {
                return new ServiceResponse(412, "Información", "Su cuenta aún no ha sido validada por el equipo de Carros Facil, nos estaremos comunicando con usted proximamente."
                    , null);
            }

            const token = await this._tokenService.generateToken({
                _id: user.object.id,
                role: "company",
                companyId: company.object.id,
                userType: user.object.userType
            })
            return new ServiceResponse(200, "", "", token);
        } catch (error) {
            this._logger.error(`Auth: Error no controlado loginCompany ${error}`);
            return new ServiceResponse(500, "Error", "No se pudo completar su inicio de sesión", null);

        }

    }

    async resetPasswordCompany(payload: ResetPasswordDto): Promise<ServiceResponse> {
        try {
            if (payload.newPassword !== payload.newPasswordRepeat) {
                return new ServiceResponse(400, "Error", "Las contraseñas no coinciden", null);
            }

            const check = await this._codes.getOne(payload.code);
            if (check.statusCode !== 200) {
                return new ServiceResponse(400, "Error", "Código expirado o ya usado", null);
            }

            const user = await this._users.findById(check.object.user);
            if (user.statusCode !== 200) {
                return new ServiceResponse(404,
                    "Error",
                    "Usuario no encontrado, favor comuníquese con soporte técnico",
                    null);
            }

            const company = await this._companies.findByUserId(user.object.id);
            if (company.statusCode !== 200) {

                return new ServiceResponse(400, "Error", "No se pudo restablecer su contraseña", null);
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(payload.newPassword, salt);

            const result = await this._users.changePassword(user.object.id, hashedPassword);
            if (result.statusCode === 200) {
                await this._codes.changeStatus(check.object.id);
            }

            return result;

        } catch (error) {
            this._logger.error(`Auth: Error no controlado resetPasswordCompany ${error}`);
            return new ServiceResponse(500, "Error", "No se pudo completar su cambio de clave", null);

        }

    }

    async changePasswordCompany(payload: ChangePasswordDto, userId: string): Promise<ServiceResponse> {
        try {
            if (payload.newPassword !== payload.newPasswordRepeat) {
                return new ServiceResponse(400, "Error", "Las contraseñas no coinciden", null);
            }

            const user = await this._users.findById(userId);
            if (user.statusCode !== 200) {
                return new ServiceResponse(404,
                    "Error",
                    "Usuario no encontrado, favor comuníquese con soporte técnico",
                    null);
            }

            const validPassword = await bcrypt.compare(payload.currentPassword, user.object.password);
            if (!validPassword) {
                return new ServiceResponse(400, "Error", "Contraseña actual incorrecta", null);
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(payload.newPassword, salt);

            return this._users.changePassword(user.object.id, hashedPassword);

        } catch (error) {
            this._logger.error(`Auth: Error no controlado resetPasswordCompany ${error}`);
            return new ServiceResponse(500, "Error", "No se pudo completar su cambio de clave", null);

        }

    }

    async loginClient(payload: UsersLoginDto): Promise<ServiceResponse> {
        try {

            const user = await this._users.findByEmail(payload.email);
            if (user.statusCode !== 200) {
                return new ServiceResponse(400, "Error", "Usuario o contraseña incorrectos", null);
            }

            const userType = await this._usersTypes.findByName('Client');
            if (userType.statusCode !== 200) {
                return new ServiceResponse(400, "Error", "No se pudo completar su inicio de sesión", null);
            }

            if (!this._operations.compareMongoDBIds(userType.object.id, user.object.userType)) {
                return new ServiceResponse(400, "Error", "Usted no tiene una cuenta de Cliente, por favor ir al módulo de Rent Car para continuar.", null);
            }

            const validPassword = await bcrypt.compare(payload.password, user.object.password);
            if (!validPassword) {
                return new ServiceResponse(400, "Error", "Usuario o contraseña incorrectos", null);
            }

            const client = await this._clients.findByUserId(user.object.id);
            if (client.statusCode !== 200) {

                return new ServiceResponse(400, "Error", "No se pudo completar su inicio de sesión", null);
            }

            if (client.object.userStatus.name === "Pending") {
                return new ServiceResponse(412, "Error", "Su cuenta aún no ha sido verificada. Por favor revise su correo y valide su usuario"
                    , null);
            }

            const token = await this._tokenService.generateToken({
                _id: user.object.id,
                role: "client",
                clientId: client.object.id,
                userType: user.object.userType
            })
            return new ServiceResponse(200, "", `Bienvenido ${client.object.firstName}`, token);
        } catch (error) {
            this._logger.error(`Auth: Error no controlado loginClient ${error}`);
            return new ServiceResponse(500, "Error", "No se pudo completar su inicio de sesión", null);

        }

    }

    async resetPasswordClient(payload: ResetPasswordDto): Promise<ServiceResponse> {
        try {
            if (payload.newPassword !== payload.newPasswordRepeat) {
                return new ServiceResponse(400, "Error", "Las contraseñas no coinciden", null);
            }

            const check = await this._codes.getOne(payload.code);
            if (check.statusCode !== 200) {
                return new ServiceResponse(400, "Error", "Código expirado o ya usado", null);
            }

            const user = await this._users.findById(check.object.user);
            if (user.statusCode !== 200) {
                return new ServiceResponse(404,
                    "Error",
                    "Usuario no encontrado, favor comuníquese con soporte técnico",
                    null);
            }

            const client = await this._clients.findByUserId(user.object.id);
            if (client.statusCode !== 200) {

                return new ServiceResponse(400, "Error", "No se pudo completar su cambio de contraseña", null);
            }


            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(payload.newPassword, salt);

            const result = await this._users.changePassword(user.object.id, hashedPassword);
            if (result.statusCode === 200) {
                await this._codes.changeStatus(check.object.id);
            }

            return result;

        } catch (error) {
            this._logger.error(`Auth: Error no controlado resetPasswordClient ${error}`);
            return new ServiceResponse(500, "Error", "No se pudo completar su cambio de clave", null);

        }

    }
}
