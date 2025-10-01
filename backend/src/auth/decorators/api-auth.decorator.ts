import { applyDecorators, UseGuards, CanActivate, Type } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { CompanyGuard } from '../guards/company.guard';
import { OwnerGuard } from '../guards/owner.guard';

export function ApiAuth(options?: {
  roles?: string[];
  requireSameCompany?: boolean;
  requireOwnership?: boolean;
}) {
  const guards: Array<Type<CanActivate>> = [JwtAuthGuard];
  const decorators = [ApiBearerAuth()];

  if (options?.roles?.length) {
    guards.push(RolesGuard);
    decorators.push(
      ApiForbiddenResponse({
        description: `Acceso denegado. Se requiere uno de los siguientes roles: ${options.roles.join(', ')}`,
      }),
    );
  }

  if (options?.requireSameCompany) {
    guards.push(CompanyGuard);
    decorators.push(
      ApiForbiddenResponse({
        description: 'No tiene permisos para acceder a esta empresa',
      }),
    );
  }

  if (options?.requireOwnership) {
    guards.push(OwnerGuard);
    decorators.push(
      ApiForbiddenResponse({
        description: 'No tiene permisos para acceder a este recurso',
      }),
    );
  }

  decorators.push(
    UseGuards(...guards),
    ApiUnauthorizedResponse({
      description: 'Token inválido o expirado',
    }),
  );

  return applyDecorators(...decorators);
}
