import { Body, Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersLoginDto } from "src/dto/users-login.dto";
import { ResetPasswordDto } from "src/dto/reset-password.dto";
import { AuthCompanyMiddleware } from "src/common/middleware/auth-company.middleware";
import { ChangePasswordDto } from "src/dto/change-password.dto";

@Controller('api/auth')
export class AuthController {
    constructor(private service: AuthService) { }

    @Post('companies/login')
    async companyLogin(@Body() payload: UsersLoginDto, @Res() res) {
        const result = await this.service.loginCompany(payload);
        return res.status(result.statusCode).send(result);
    }

    @Post('companies/reset-password')
    async ResetPassword(@Body() payload: ResetPasswordDto, @Res() res) {
        const result = await this.service.resetPasswordCompany(payload);
        return res.status(result.statusCode).send(result);
    }

    @Post('companies/change-password')
    @UseGuards(AuthCompanyMiddleware)

    async ChangePassword(@Body() payload: ChangePasswordDto,@Req() req, @Res() res) {
        const result = await this.service.changePasswordCompany(payload, req.claims._id);
        return res.status(result.statusCode).send(result);
    }


    @Post('clients/login')
    async clientLogin(@Body() payload: UsersLoginDto, @Res() res) {
        const result = await this.service.loginClient(payload);
        return res.status(result.statusCode).send(result);
    }


}
