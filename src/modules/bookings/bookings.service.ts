import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoggerService } from 'src/common/logger/logger.service';
import { ServiceResponse } from 'src/common/utils/services-response';
import { Bookings } from 'src/models/bookings.model';
import { BookingStatusService } from '../booking-status/booking-status.service';
import { FromToDatesDto } from 'src/dto/from-to-dates.dto';
import { OperationsService } from 'src/common/helper/operations.service';
import { CreateBookingDto } from 'src/dto/bookings-create.dto';
import { ClientsService } from '../clients/clients.service';
import { VehicleRentCar } from 'src/models/vehicles-rent-cars.model';
import { VehiclesStatusService } from '../vehicles-status/vehicles-status.service';
import { PaymentsClientsService } from '../payments-client/payments-client.service';
import { ClientPayByPaypalDto } from 'src/dto/client-pay-paypal.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class BookingsService {

    constructor(
        @InjectModel('Bookings') private readonly model: Model<Bookings>,
        @InjectModel('VehicleRentCar') private readonly vehicles: Model<VehicleRentCar>,
        private readonly _logger: LoggerService,
        private readonly status: BookingStatusService,
        private readonly _operations: OperationsService,
        private readonly _client: ClientsService,
        private readonly _vehicleStatus: VehiclesStatusService,
        private readonly _payments: PaymentsClientsService,
        private readonly _notifications: NotificationsService,


    ) { }

    async create(payload: CreateBookingDto, clientId: string): Promise<ServiceResponse> {
        try {
            const vehicle = await this.getVehicleProfile(payload.vehicleId);
            if (vehicle.statusCode !== 200) {
                return vehicle;
            }

            const client = await this._client.getLogged(clientId);
            if (client.statusCode !== 200) {
                return client;
            }

            let days = Math.round(
                (new Date(payload.toDate).getTime() - new Date(payload.fromDate).getTime()) / (1000 * 60 * 60 * 24)
            );
            days++;

            const validateStatus = await this.status.findByName("Confirmed");
            if (validateStatus.statusCode !== 200) {
                return new ServiceResponse(400, "Error", "No se pudo completar la solicitud: Estados", null);
            }

            const serviceFee = days * vehicle.object.priceByDay * 0.1;
            const booking = new this.model({
                clientId: clientId,
                vehicle: {
                    _id: vehicle.object.id,
                    name: `${vehicle.object.make.name} ${vehicle.object.model.name} ${vehicle.object.year}`,
                    image: vehicle.object.images[0],
                },
                companyId: vehicle.object.companyId,
                priceByDay: vehicle.object.priceByDay,
                days: days,
                rcTotal: days * vehicle.object.priceByDay * 0.92,
                serviceFee: serviceFee,
                subTotal: days * vehicle.object.priceByDay,
                itbis: 0,
                total: days * vehicle.object.priceByDay + serviceFee,
                coinType: vehicle.object.coinType,
                fromDate: payload.fromDate,
                toDate: payload.toDate,
                pickupSite: payload.pickupSite,
                deliverSite: payload.deliverSite,
                bookingStatus: validateStatus.object.id,
            });
            await booking.save();
            const dataPay: ClientPayByPaypalDto = {
                vehicleId: vehicle.object.id,
                companyId: vehicle.object.companyId,
                bookingId: booking._id.toString(),
                amount: booking.total,
                coinType: vehicle.object.coinType,
                paymentNonce: payload.paymentMethodNonce,
                channel: payload.channel,
                orderId: payload.orderId,
                paymentInfo: payload.paymentInfo
            }
            const pay = await this._payments.payByPaypal(dataPay, clientId);
            if (pay.statusCode !== 200) {
                console.info(dataPay);
                await this.deleteById(booking.id, true);
                return new ServiceResponse(500, "Ha ocurrido un error interno", "Su reserva no ha podido ser procesada", null);
            } else {
                const dataEmail = {
                    email: client.object.user.email,
                    name: client.object.firstName + " " + client.object.lastName,
                    vehicle:
                        vehicle.object.make.name + " " + vehicle.object.model.name + " " + vehicle.object.year,
                    vehicleImage: vehicle.object.images[0].secureUrl,
                    fromDate: this._operations.formatDatToDMY(new Date(payload.fromDate)),
                    toDate: this._operations.formatDatToDMY(new Date(payload.toDate)),
                    pickupSite: payload.pickupSite.name,
                    deliverSite: payload.deliverSite.name,
                    bookingId: booking.id,
                }

                const sendNotification = await this._notifications.send('mail/client/booking/confirmation', dataEmail);
                if (sendNotification.statusCode !== 200) {
                    this._logger.error(`Bookings: ERROR: No se pudo enviar el correo de reserva a ${dataEmail.email}. ${JSON.stringify(dataEmail)}`);
                }

            }

            return new ServiceResponse(200, "Success", "Reserva confirmada", null);

        } catch (error) {
            this._logger.error(`Bookings: Error no controlado create ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async getByClient(clientId: string): Promise<ServiceResponse> {
        try {
            const list = await this.model.find(
                { clientId: clientId, deleted: false },
                { deleted: 0 }
            )
                .populate("bookingStatus")
                .sort({ createdDate: -1 });
            return new ServiceResponse(200, "Ok", "", list);
        } catch (error) {
            this._logger.error(`Bookings: Error no controlado findAll ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async getReservedDatesByVehicle(vehicleId: string): Promise<ServiceResponse> {
        try {
            const validateStatus = await this.status.findByName("Confirmed");
            if (validateStatus.statusCode !== 200) {
                return new ServiceResponse(400, "Error", "No se pudo completar la solicitud", null);
            }
            var today = new Date();
            const bookings = await this.model.find({
                "vehicle._id": vehicleId,
                deleted: false,
                bookingStatus: validateStatus.object.id,
                $or: [
                    {
                        fromDate: {
                            $gte: today,
                        },
                    },
                    {
                        toDate: {
                            $gte: today,
                        },
                    },
                ],
            }).select("fromDate toDate");

            let arr = [];
            if (bookings.length > 0) {
                for (let book of bookings) {
                    for (
                        var d = book.fromDate;
                        d <= book.toDate;
                        d.setDate(d.getDate() + 1)
                    ) {
                        arr.push(new Date(d));
                    }
                }
            }
            return new ServiceResponse(200, "Ok", "", arr);
        } catch (error) {
            this._logger.error(`Bookings: Error no controlado getReservedDatesByVehicle ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async getBookedVehiclesByDates(dates: FromToDatesDto): Promise<ServiceResponse> {
        try {
            const validateStatus = await this.status.findByName("Confirmed");
            if (validateStatus.statusCode !== 200) {
                return new ServiceResponse(400, "Error", "No se pudo completar la solicitud", null);
            }

            const notAvaliable = await this.model.find({
                bookingStatus: validateStatus.object.id,
                deleted: false,
                $or: [
                    {
                        fromDate: {
                            $gte: dates.fromDate,
                            $lte: dates.toDate,
                        },
                    },
                    {
                        toDate: {
                            $gte: dates.fromDate,
                            $lte: dates.toDate,
                        },
                    },
                ],
            }).select({ "vehicle._id": 1 });
            let arr = [];
            for (const c of notAvaliable) {
                arr.push(c.vehicle._id);
            }

            return new ServiceResponse(200, "Ok", "", arr);

        } catch (error) {
            this._logger.error(`Bookings: Error no controlado getBookedVehiclesByDates ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async findById(id: string): Promise<ServiceResponse> {
        try {
            const doc = await this.model.findById(id).populate("bookingStatus");
            if (!doc) {
                return new ServiceResponse(404, "Booking not found", "", null);
            }
            return new ServiceResponse(200, "Ok", "", doc);
        } catch (error) {
            this._logger.error(`Bookings: Error no controlado findById ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async deleteById(id: string, bySystem?: boolean): Promise<ServiceResponse> {
        try {

            const booking = await this.findById(id);
            if (booking.statusCode !== 200) {
                return new ServiceResponse(400, "Error", "No se pudo completar la solicitud", null);
            }

            const validateStatus = await this.status.findByName("Cancelled");
            if (validateStatus.statusCode !== 200) {
                return new ServiceResponse(400, "Error", "No se pudo completar la solicitud", null);
            }

            if (!bySystem && !this._operations.compareMongoDBIds(booking.object.bookingStatus, validateStatus.object.id)) {
                return new ServiceResponse(400, "Info", "Esta reserva no se puede eliminar", null);
            }

            await this.model.findByIdAndUpdate(id, {
                deleted: true,
            });

            return new ServiceResponse(200, "Ok", "Reserva eliminada correctamente", null);

        } catch (error) {
            this._logger.error(`Bookings: Error no controlado deleteById ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }

    }

    async hasBeenBooking(vehicleId: string): Promise<ServiceResponse> {
        try {
            const validateStatus = await this.status.findByName("Confirmed");
            if (validateStatus.statusCode !== 200) {
                return new ServiceResponse(400, "Error", "No se pudo completar la solicitud", null);
            }

            var today = new Date();
            const bookings = await this.model.find({
                "vehicle._id": vehicleId,
                deleted: false,
                bookingStatus: validateStatus.object.id,
                fromDate: {
                    $lte: today,
                },
            }).select("fromDate toDate");

            return new ServiceResponse(200, "Ok", "", { hasBeenBooking: bookings.length > 0 });

        } catch (error) {
            this._logger.error(`Bookings: Error no controlado hasBeenBooking ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async getByCompany(companyId: string): Promise<ServiceResponse> {
        try {
            const bookings = await this.model.find(
                { companyId: companyId, deleted: false },
                { deleted: 0 }
            ).populate("bookingStatus");
            return new ServiceResponse(200, "Ok", "", bookings);

        } catch (error) {
            this._logger.error(`Bookings: Error no controlado getByCompany ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async bookingToProgress(): Promise<ServiceResponse> {
        try {
            const date = new Date();
            date.setDate(date.getDate() - 1);

            const confirmedStatus = await this.status.findByName("Confirmed");
            if (confirmedStatus.statusCode !== 200) {
                return new ServiceResponse(400, "Error", "No se pudo completar la solicitud", null);
            }
            const progressStatus = await this.status.findByName("In Progress");
            if (progressStatus.statusCode !== 200) {
                return new ServiceResponse(400, "Error", "No se pudo completar la solicitud", null);
            }

            const filter = {
                deleted: false,
                bookingStatus: confirmedStatus.object.id,
                fromDate: { $lte: date },
            };
            const bookings = await this.model.updateMany(filter, {
                bookingStatus: progressStatus.object.id,
            });

            return new ServiceResponse(200, "Success", "", bookings);

        } catch (error) {
            this._logger.error(`Bookings: Error no controlado bookingToProgress ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async bookingsToComplete(): Promise<ServiceResponse> {
        try {
            const date = new Date();
            date.setDate(date.getDate() - 1);

            const completedStatus = await this.status.findByName("Completed");
            if (completedStatus.statusCode !== 200) {
                return new ServiceResponse(400, "Error", "No se pudo completar la solicitud", null);
            }
            const progressStatus = await this.status.findByName("In Progress");
            if (progressStatus.statusCode !== 200) {
                return new ServiceResponse(400, "Error", "No se pudo completar la solicitud", null);
            }

            const filter = {
                deleted: false,
                bookingStatus: progressStatus.object.id,
                fromDate: { $lte: date },
            };
            const bookings = await this.model.updateMany(filter, {
                bookingStatus: completedStatus.object.id,
            });

            return new ServiceResponse(200, "Success", "", bookings);

        } catch (error) {
            this._logger.error(`Bookings: Error no controlado bookingToProgress ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    async bookingsToCancel(): Promise<ServiceResponse> {
        try {
            const date = new Date();
            date.setDate(date.getDate() - 1);

            const cancelationProcessStatus = await this.status.findByName("Cancelation Process");
            if (cancelationProcessStatus.statusCode !== 200) {
                return new ServiceResponse(400, "Error", "No se pudo completar la solicitud", null);
            }
            const bookings = await this.model.find({
                bookingStatus: cancelationProcessStatus.object.id,
            }).select("_id");;

            if (!bookings || bookings.length === 0) {
                return new ServiceResponse(404, "No se ha encontrado reservas pendientes de cancelar", "", null)
            }

            return new ServiceResponse(200, "Success", "", bookings);

        } catch (error) {
            this._logger.error(`Bookings: Error no controlado bookingToProgress ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    private async getVehicleProfile(id: string): Promise<ServiceResponse> {
        try {
            const validateStatus = await this._vehicleStatus.findByName("Disponible");
            if (validateStatus.statusCode !== 200) {
                return new ServiceResponse(400, "Error", "Status are not defined", null);
            }

            const vehicle = await this.vehicles.findOne({
                _id: id,
                deleted: false,
                vehiclesStatus: validateStatus.object.id,
            })
                .populate("vehiclesFuel")
                .populate("vehiclesTypes").exec();
            return new ServiceResponse(vehicle ? 200 : 404, "", "", vehicle);
        } catch (error) {
            this._logger.error(`Bookings: Error no controlado getProfile ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);
        }
    }

    public async sendCreateBookingEmail(data: any): Promise<ServiceResponse> {
        try {
            const send = await this._notifications.send('mail/client/booking/confirmation', data);
            if (send.statusCode !== 200) {
                this._logger.error(`ERROR: No se pudo enviar la solicitud a ${data.email}. ${JSON.stringify(data)}`);
            }
            return send;
        } catch (error) {
            this._logger.error(`Clients: Error no controlado sendCreateClientEmail ${error}`);
            return new ServiceResponse(500, "Error", "Ha ocurrido un error inesperado", error);

        }

    }

}