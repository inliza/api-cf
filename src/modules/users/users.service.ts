import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoggerService } from 'src/common/logger/logger.service';
import { Users } from 'src/models/users.model';
import * as bcrypt from 'bcrypt';
import { UsersCreateDto } from 'src/dto/users-create.dto';
import { ServiceResponse } from 'src/common/utils/services-response';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('Users') private readonly model: Model<Users>,
        private readonly _logger: LoggerService
    ) { }


    async registerUser(req: UsersCreateDto): Promise<ServiceResponse> {
        try {
            const userExists = await this.model.findOne({ email: req.email });

            if (userExists) {
                return new ServiceResponse(400, "Error", "Este usuario ya existe", req);
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.password, salt);

            const newUser = new this.model({
                email: req.email,
                password: hashedPassword,
                userType: req.userType
            });

            await newUser.save();
            this._logger.info(`Users: Usuario registrado correctamente: ${req.email}`);
            return new ServiceResponse(200, "Success", "User Created", newUser);
        } catch (error) {
            this._logger.error(`Users: Error no controlado registerUser ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);

        }

    }

    async findByEmail(email: string): Promise<ServiceResponse> {
        try {
            const user = await this.model.findOne({ email: email }).populate('userType')
            .exec();;
            if (!user) {
                return new ServiceResponse(404, "User not found", "", null);
            }
            return new ServiceResponse(200, "Ok", "", user);
        } catch (error) {

            this._logger.error(`Users: Error no controlado findByEmail ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);

        }

    }


}
