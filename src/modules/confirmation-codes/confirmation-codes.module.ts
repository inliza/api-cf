import { Module } from "@nestjs/common";
import { CommonModule } from "src/common/common.module";
import { ConfirmationCodesService } from "./confirmation-codes.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfirmationCodes, ConfirmationShema } from "src/models/confirmation-codes.model";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ConfirmationCodes.name, schema: ConfirmationShema }
        ]), CommonModule,
    ],
    providers: [ConfirmationCodesService],
    exports: [ConfirmationCodesService]
})
export class ConfirmationCodesModule { }