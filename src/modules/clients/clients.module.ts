import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CommonModule } from "src/common/common.module";
import { HelperModule } from "src/common/helper/helper.module";
import { Clients, ClientsSchema } from "src/models/clients.model";
import { ClientsService } from "./clients.service";
import { ClientsController } from "./clients.controller";
import { UsersModule } from "../users/users.module";
import { UserStatusModule } from "../user-status/user-status.module";
import { DocumentsTypesModule } from "../documents-types/documents-types.module";
import { UserTypesModule } from "../user-types/user-types.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { ConfirmationCodesModule } from "../confirmation-codes/confirmation-codes.module";
import { GenderModule } from "../gender/gender.module";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Clients.name, schema: ClientsSchema }]),
        CommonModule,
        UsersModule,
        UserStatusModule,
        DocumentsTypesModule,
        UserTypesModule,
        HelperModule,
        NotificationsModule,
        ConfirmationCodesModule,
        GenderModule
    ],
    providers: [ClientsService],
    controllers: [ClientsController],
    exports: [ClientsService]
})
export class ClientsModule { }
