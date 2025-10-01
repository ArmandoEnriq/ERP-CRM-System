// OwnerGuard: Solo propietarios del recurso pueden acceder

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequestUser } from '../interfaces/auth.interface';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireOwnership = this.reflector.getAllAndOverride<boolean>(
      'requireOwnership',
      [context.getHandler(), context.getClass()],
    );

    if (!requireOwnership) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: RequestUser = request.user;
    const resourceUserId = request.params.userId || request.body.userId;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // Super admin y admin pueden acceder a cualquier recurso
    if (['super_admin', 'admin'].includes(user.role)) {
      return true;
    }

    // Verificar si el usuario es propietario del recurso
    if (user.userId !== resourceUserId) {
      throw new ForbiddenException(
        'No tiene permisos para acceder a este recurso',
      );
    }

    return true;
  }
}
