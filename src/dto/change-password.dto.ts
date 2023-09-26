import { IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    newPassword: string;

    @IsNotEmpty()
    @IsString()
    newPasswordRepeat: string;

    @IsNotEmpty()
    @IsString()
    currentPassword: string;
  }
  