// LocalAuthGuard: Login con email/password

import {
  Injectable,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // Validar que los campos requeridos estén presentes
    if (!request.body.email || !request.body.password) {
      throw new BadRequestException('Email y contraseña son requeridos');
    }

    return super.canActivate(context);
  }
}
