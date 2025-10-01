// LocalStrategy: Validación de credenciales

import { Strategy } from 'passport-local'; // estrategia de autenticación local (email y password)
import { PassportStrategy } from '@nestjs/passport'; // para crear estrategias de passport
import { Injectable, UnauthorizedException } from '@nestjs/common'; // para manejar errores
import { AuthService } from '../auth.service'; // servicio de autenticación

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // contructor que recibe el servicio de autenticación
    super({
      // constructor para el padre (PassportStrategy) donde le decimos que en vez de usar username y password, usaremos email y password
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return user;
  }
}
