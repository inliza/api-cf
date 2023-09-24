import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { LoggerService } from "./logger/logger.service";
import { HelperModule } from "./helper/helper.module";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { AuthClientMiddleware } from "./middleware/auth-client.middleware";
import { AuthCompanyMiddleware } from "./middleware/auth-company.middleware";

@Module({
    imports: [DatabaseModule, HelperModule],
    providers: [LoggerService, AuthMiddleware,AuthClientMiddleware,AuthCompanyMiddleware],
    exports: [LoggerService, AuthMiddleware,AuthClientMiddleware,AuthCompanyMiddleware]
})
export class CommonModule { }