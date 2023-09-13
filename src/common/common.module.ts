import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { LoggerService } from "./logger/logger.service";
import { HelperModule } from "./helper/helper.module";
import { AuthMiddleware } from "./middleware/auth.middleware";

@Module({
    imports: [DatabaseModule,HelperModule],
    providers: [LoggerService, AuthMiddleware],
    exports: [LoggerService, AuthMiddleware]
})
export class CommonModule { }