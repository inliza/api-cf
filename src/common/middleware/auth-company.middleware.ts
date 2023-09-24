// auth.middleware.ts

import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from '../helper/token.service';

@Injectable()
export class AuthCompanyMiddleware implements CanActivate {
  constructor(private jwtService: TokenService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const forbidden = new ForbiddenException('You dont have access to access this resource');
    
    if (!token) {
      throw new UnauthorizedException('Without authorization');
    }
    try {
      const payload = await this.jwtService.verifyToken(token);

      if (payload.role !== 'company') {
        throw forbidden;
      }

      request['claims'] = payload;
    } catch (error) {
      if (error.status === 403) {
        throw forbidden;
      }
      throw new UnauthorizedException('Invalid authorization');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
