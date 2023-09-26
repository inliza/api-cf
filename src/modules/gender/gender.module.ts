import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CommonModule } from "src/common/common.module";
import { Gender, GenderSchema } from "src/models/gender.model";
import { GenderService } from "./gender.service";
import { GenderController } from "./gender.controller";
import { HelperModule } from "src/common/helper/helper.module";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Gender.name, schema: GenderSchema }]),
        CommonModule,
        HelperModule
    ],
    providers: [GenderService],
    controllers: [GenderController],
    exports: [GenderService]
})
export class GenderModule { }
