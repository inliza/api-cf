import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { HelperModule } from 'src/common/helper/helper.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { CompaniesModule } from '../companies/companies.module';
import { ConfirmationCodesModule } from '../confirmation-codes/confirmation-codes.module';
import { ClientsModule } from '../clients/clients.module';
import { UserTypesModule } from '../user-types/user-types.module';


@Module({
    imports: [
        CommonModule,
        HelperModule,
        UsersModule,
        CompaniesModule,
        ConfirmationCodesModule,
        ClientsModule,
        UserTypesModule
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {}