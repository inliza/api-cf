// auth.middleware.ts

import { CanActivate, ExecutionContext, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from '../helper/token.service';

@Injectable()
export class AuthMiddleware implements CanActivate {
  constructor(private jwtService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Without authorization');
    }
    try {
      const payload = await this.jwtService.verifyToken(token);
      request['claims'] = payload;
    } catch {
      throw new UnauthorizedException('Invalid authorization');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
