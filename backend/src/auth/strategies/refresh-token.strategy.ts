// RefreshTokenStrategy: Manejo de refresh tokens

import { PassportStrategy } from '@nestjs/passport'; // para crear estrategias de passport
import { Strategy } from 'passport-jwt'; // estrategia de autenticación JWT
import { Injectable, UnauthorizedException } from '@nestjs/common'; // para manejar errores
import { ConfigService } from '@nestjs/config'; // para acceder a las variables de entorno
import { Request } from 'express'; // para manejar las solicitudes
import { AuthService } from '../auth.service'; // servicio de autenticación

@Injectable() // para que se pueda inyectar en otros servicios
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  // estrategia de autenticación JWT pero con refresh token
  constructor(
    // constructor que recibe el servicio de autenticación
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      // constructor para el padre (PassportStrategy)
      jwtFromRequest: (req: Request) => {
        return req.body?.refreshToken || null;
      }, // extraer el JWT (token) del cuerpo de la solicitud
      ignoreExpiration: false, // no ignorar la expiración
      secretOrKey: configService.get<string>('auth.jwt.refreshSecret'), // llave de autenticación
      passReqToCallback: true, // pasar la solicitud al callback
    });
  }

  async validate(req: Request, payload: any) {
    // validar el refresh token
    const refreshToken = req.body?.refreshToken; // obtener el refresh token del cuerpo de la solicitud

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token requerido'); // si no hay refresh token
    }

    const isValid = await this.authService.validateRefreshToken(
      payload.sub,
      refreshToken,
    ); // validar el refresh token

    if (!isValid) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      sessionId: payload.sessionId,
    };
  }
}
