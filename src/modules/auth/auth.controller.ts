import { Body, Controller, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersLoginDto } from "src/dto/users-login.dto";

@Controller('api/auth')
export class AuthController {
    constructor(private service: AuthService) { }



    @Post('clogin')
    async Save(@Body() payload: UsersLoginDto, @Res() res) {
        const result = await this.service.loginCompany(payload);
        return res.status(result.statusCode).send(result);
    }
}
