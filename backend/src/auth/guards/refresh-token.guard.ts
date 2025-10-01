// RefreshTokenGuard: Validación de refresh tokens

import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (!request.body.refreshToken) {
      throw new UnauthorizedException('Refresh token es requerido');
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw (
        err || new UnauthorizedException('Refresh token inválido o expirado')
      );
    }
    return user;
  }
}
