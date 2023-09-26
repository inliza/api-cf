import { IsNotEmpty, IsString } from "class-validator";

export class ResetPasswordDto {
    @IsNotEmpty()
    @IsString()
    newPassword: string;

    @IsNotEmpty()
    @IsString()
    newPasswordRepeat: string;

    @IsNotEmpty()
    @IsString()
    code: string;
  }
  