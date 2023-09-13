import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_KEY,
            signOptions: { expiresIn: '4h' },
        }),
    ],
    providers: [
        TokenService
    ],
    exports: [TokenService]
})
export class HelperModule { }
