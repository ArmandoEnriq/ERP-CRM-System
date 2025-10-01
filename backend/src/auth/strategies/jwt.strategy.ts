// JwtStrategy: Validación y deserialización de JWT

import { ExtractJwt, Strategy } from 'passport-jwt'; // estrategia de autenticación JWT (por token)
import { PassportStrategy } from '@nestjs/passport'; // para crear estrategias de passport
import { Injectable, UnauthorizedException } from '@nestjs/common'; // para manejar errores
import { ConfigService } from '@nestjs/config'; // para acceder a las variables de entorno
import { AuthService } from '../auth.service'; // servicio de autenticación
import { JwtPayload, RequestUser } from '../interfaces/auth.interface'; // interfaces (debe cumplir la estructura de JwtPayload y RequestUser)

@Injectable() // decorador para indicar que la clase es un servicio inyectable
export class JwtStrategy extends PassportStrategy(Strategy) {
  // creamos la estrategia Passport del tipo jwt
  constructor(
    // constructor que recibe el servicio de autenticación y el servicio de configuración (para acceder a las variables de entorno)
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      // constructor para el padre (PassportStrategy) como se manejara
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // extraer el JWT (token) del encabezado de autorización
      ignoreExpiration: false, // no ignorar la expiración
      secretOrKey: configService.get<string>('auth.jwt.secret'), // llave de autenticación
      issuer: configService.get<string>('auth.jwt.issuer'), // credencial del token que proviene de la app
      audience: configService.get<string>('auth.jwt.audience'), // credencial del token que verifica quien puede usar el token
    });
  }

  async validate(payload: JwtPayload): Promise<RequestUser> {
    // función async que recibe un JwtPayload (estructura) y devuelve un RequestUser (estructura)
    // Verificar que la sesión siga siendo válida
    const isValidSession = await this.authService.validateSession(
      // verificar que la sesión siga siendo válida
      payload.sessionId, // id de la sesión
      payload.sub, // id del usuario
    );

    if (!isValidSession) {
      // si la sesión no es válida
      throw new UnauthorizedException('Sesión inválida o expirada');
    }

    return {
      // si la sesión es válida, devolver el usuario
      userId: payload.sub, // id del usuario
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: payload.role,
      companyId: payload.companyId,
      sessionId: payload.sessionId,
    };
  }
}
