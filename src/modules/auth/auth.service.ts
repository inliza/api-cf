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

@Injectable()
export class AuthService {

    constructor(
        private readonly _users: UsersService,
        private readonly _companies: CompaniesService,
        private readonly _tokenService: TokenService,
        private readonly _logger: LoggerService,
        private readonly _codes: ConfirmationCodesService

    ) { }

    async loginCompany(payload: UsersLoginDto): Promise<ServiceResponse> {
        try {

            const user = await this._users.findByEmail(payload.email);
            if (user.statusCode !== 200) {
                return new ServiceResponse(400, "Error", "Usuario o contraseña incorrectos", null);
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
                return new ServiceResponse(400, "Error", "Su cuenta aún no ha sido validada por el equipo de Carros Facil, nos estaremos comunicando con usted proximamente."
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
                return new ServiceResponse(400, "Error", "Invalid request", null);
            }

            const user = await this._users.findById(check.object.user);
            if (user.statusCode !== 200) {
                return new ServiceResponse(404,
                    "Error",
                    "Usuario no encontrado, favor comuníquese con soporte técnico",
                    null);
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(payload.newPassword, salt);

            return this._users.changePassword(user.object.id, hashedPassword);

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
}
