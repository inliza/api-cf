import { HttpStatus } from "@nestjs/common";

export class ServiceResponse {
    statusCode: number;
    title: string;
    message: string;
    object: any;

    constructor(statusCode: HttpStatus, title:string, message: string, object: any,) {
        this.statusCode = statusCode;
        this.title = title;
        this.object = object;
        this.message = message;
    }
}
