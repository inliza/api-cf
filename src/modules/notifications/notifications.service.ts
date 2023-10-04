import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpCallService } from 'src/common/helper/http-call.service';
import { LoggerService } from 'src/common/logger/logger.service';
import { ServiceResponse } from 'src/common/utils/services-response';

@Injectable()
export class NotificationsService {

    constructor(
        private readonly http: HttpCallService,
        private configService: ConfigService,
        private readonly _logger: LoggerService,

    ) { }

    async send(endpoint: string, data: any): Promise<ServiceResponse> {
        try {
            const url = `${this.configService.get('API_NOTIFICATIONS')}${endpoint}`;
            const res = await this.http.post(url, data);
            this._logger.info(`Notifications: Correo enviado correctamente ${endpoint}`);
            return new ServiceResponse(200, "Ok", "Notification send", res.data);
        } catch (error) {
            this._logger.error(`Notifications: Error en envio de notificacion ${endpoint}`);
            return new ServiceResponse(400, "Ok", error.message, error);
        }
    }

}