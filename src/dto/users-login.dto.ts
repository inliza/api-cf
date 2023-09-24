import { IsEmail, IsString } from "class-validator";

export class UsersLoginDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;

}