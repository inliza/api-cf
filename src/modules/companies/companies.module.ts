import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CommonModule } from "src/common/common.module";
import { Companies, CompaniesSchema } from "src/models/companies.model";
import { CompaniesService } from "./companies.service";
import { CompaniesController } from "./companies.controller";
import { UsersModule } from "../users/users.module";
import { UserStatusModule } from "../user-status/user-status.module";
import { DocumentsTypesModule } from "../documents-types/documents-types.module";
import { UserTypesModule } from "../user-types/user-types.module";
import { CitiesModule } from "../cities/cities.module";
import { HelperModule } from "src/common/helper/helper.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { ConfirmationCodesModule } from "../confirmation-codes/confirmation-codes.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Companies.name, schema: CompaniesSchema },
        ]),
        CommonModule,
        UsersModule,
        UserStatusModule,
        DocumentsTypesModule,
        UserTypesModule,
        CitiesModule,
        HelperModule,
        NotificationsModule,
        ConfirmationCodesModule
    ],
    providers: [CompaniesService],
    controllers: [CompaniesController],
    exports: [CompaniesService]
})
export class CompaniesModule { }
