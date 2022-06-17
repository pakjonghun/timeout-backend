import { JwtService } from '@nestjs/jwt';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request } from 'express';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  async use(req: Request, _: any, next: (error?: any) => void) {
    const token = req.cookies['jwt'];
    if (token) {
      const { id, role } = await this.jwtService.verifyAsync(token);
      if (id && role) {
        req['user'] = { id, role };
      }
    }

    next();
  }
}
