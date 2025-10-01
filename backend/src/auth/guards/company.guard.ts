// CompanyGuard: Acceso por empresa

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequestUser } from '../interfaces/auth.interface';

@Injectable()
export class CompanyGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireSameCompany = this.reflector.getAllAndOverride<boolean>(
      'requireSameCompany',
      [context.getHandler(), context.getClass()],
    );

    if (!requireSameCompany) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: RequestUser = request.user;
    const { companyId } = request.params;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    // Super admin puede acceder a cualquier empresa
    if (user.role === 'super_admin') {
      return true;
    }

    // Verificar si el usuario pertenece a la empresa
    if (user.companyId !== companyId) {
      throw new ForbiddenException(
        'No tiene permisos para acceder a esta empresa',
      );
    }

    return true;
  }
}
