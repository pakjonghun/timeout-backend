import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleType } from './entities/user.entity';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request['user'];
    const roleInput = this.reflector.get<RoleType | 'Any'>(
      'role',
      context.getHandler(),
    );

    switch (roleInput) {
      case 'Client':
      case 'Manager':
        return user?.['role'] === roleInput;
      case 'Any':
        return Boolean(user);
      case undefined:
        return true;
      default:
        throw new ForbiddenException('인증이 실패했습니다.');
    }
  }
}
