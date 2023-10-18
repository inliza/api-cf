import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { HelperModule } from './common/helper/helper.module';
import { CitiesModule } from './modules/cities/cities.module';
import { CountriesModule } from './modules/countries/countries.module';
import { CitiesPickupModule } from './modules/cities-pickup/cities-pickup.module';
import { DocumentsTypesModule } from './modules/documents-types/documents-types.module';
import { UserTypesModule } from './modules/user-types/user-types.module';
import { UserStatusModule } from './modules/user-status/user-status.module';
import { CompaniesPickupsModule } from './modules/companies-pickups/companies-pickups.module';
import { AuthModule } from './modules/auth/auth.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ConfirmationCodesModule } from './modules/confirmation-codes/confirmation-codes.module';
import { GenderModule } from './modules/gender/gender.module';
import { ClientsModule } from './modules/clients/clients.module';
import { SubscriptionsPlansModule } from './modules/subscriptions-plans/subscriptions-plans.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { BookingStatusModule } from './modules/booking-status/booking-status.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { MakesModule } from './modules/makes/makes.module';
import { ModelsModule } from './modules/models/models.module';
import { VehiclesFuelModule } from './modules/vehicles-fuel/vehicles-fuel.module';
import { VehiclesTypesModule } from './modules/vehicles-types/vehicles-types.module';
import { VehiclesStatusModule } from './modules/vehicles-status/vehicles-status.module';
import { VehiclesRentCarsModule } from './modules/vehicles-rent-cars/vehicles-rent-cars.module';
import { YearsModule } from './modules/years/years.module';
import { PaymentsClientsModule } from './modules/payments-client/payments-client.module';
import { PaymentsStatusModule } from './modules/payments-status/payments-status.module';
import { PaymentsTypesModule } from './modules/payments-types/payments-types.module';
import { PaymentsChannelsModule } from './modules/payments-channels/payments-channels.module';
import { VehicleImagesModule } from './modules/vehicle-images/vehicle-images.module';
import { PaymentsCompaniesModule } from './modules/payments-companies/payments-companies.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    CommonModule,
    HelperModule,
    CitiesModule,
    CountriesModule,
    CitiesPickupModule,
    DocumentsTypesModule,
    UserTypesModule,
    UserStatusModule,
    CompaniesPickupsModule,
    AuthModule,
    NotificationsModule,
    ConfirmationCodesModule,
    GenderModule,
    ClientsModule,
    SubscriptionsPlansModule,
    SubscriptionsModule,
    BookingStatusModule,
    BookingsModule,
    MakesModule,
    ModelsModule,
    VehiclesFuelModule,
    VehiclesTypesModule,
    VehiclesStatusModule,
    VehiclesRentCarsModule,
    YearsModule,
    PaymentsClientsModule,
    PaymentsStatusModule,
    PaymentsTypesModule,
    PaymentsChannelsModule,
    VehicleImagesModule,
    PaymentsCompaniesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
