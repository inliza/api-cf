import { IsEmail, IsNotEmpty } from "class-validator";

export class bodyEmailDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

  }
  