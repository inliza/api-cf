import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { HttpModule } from '@nestjs/axios';
import { HttpCallService } from './http-call.service';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_KEY,
            signOptions: { expiresIn: '4h' },
        }),
        HttpModule
    ],
    providers: [
        TokenService,
        HttpCallService
    ],
    exports: [TokenService, HttpCallService]
})
export class HelperModule { }
