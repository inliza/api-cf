import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Observable, lastValueFrom, map } from 'rxjs';

@Injectable()
export class HttpCallService {
    constructor(private readonly httpService: HttpService) { }

    async get(url: string, data?: any, headers? : AxiosRequestConfig): Promise<any> {
        const config: AxiosRequestConfig = headers ?? this.getHeaders();
        config.data = data;
        return lastValueFrom(this.httpService
            .get(url, config)
            .pipe(map((response) => response)
            ));
    }

    async post(url: string, data?: any,  headers? : AxiosRequestConfig): Promise<any> {
        const config: AxiosRequestConfig = headers ?? this.getHeaders();
        return lastValueFrom(this.httpService
            .post(url, data, config)
            .pipe(map((response) => response)
            ));
    }

    private getHeaders(): any {
        return {
            headers: {
                'Content-Type': 'application/json',
                id: new Date().getTime(),
            }
        }
    }
}
