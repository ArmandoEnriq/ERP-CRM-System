import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';

import { User } from '../users/entities/user.entity';
import { UserSession } from './entities/user-session.entity';
import { PasswordReset } from './entities/password-reset.entity';

@Module({
  imports: [
    ConfigModule, // usaremos de aqui el ConfigService para obtener las variables de entorno
    PassportModule.register({ defaultStrategy: 'jwt' }), // passport es una biblioteca para autenticación y le decimos que usaremos JWT
    JwtModule.registerAsync({
      // configuración de JWT asíncrona (primero se cargan las variables de entorno y luego se usa la configuración)
      imports: [ConfigModule], // usaremos las variables de entorno
      useFactory: async (configService: ConfigService) => ({
        // creamos una función de fabrica que recibe una función la cual recibe el servicio de configuración (recibe un configService)
        secret: configService.get<string>('auth.jwt.secret'), // llave de autenticación
        signOptions: {
          expiresIn: configService.get<string>('auth.jwt.expiresIn'), // tiempo de expiración
          issuer: configService.get<string>('auth.jwt.issuer'), // credencial del token que proviene de la app
          audience: configService.get<string>('auth.jwt.audience'), // credencial del token que verifica quien puede usar el token
        },
      }),
      inject: [ConfigService], // inyectamos el servicio de configuración
    }),
    TypeOrmModule.forFeature([User, UserSession, PasswordReset]), // para decir que podemos usar estos entidades en este módulo
  ], // Modulos que necesitamos en este módulo
  controllers: [AuthController], // Rutas de este módulo
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshTokenStrategy], // Servicios, estrategias, helpers que se inyectan
  exports: [AuthService, JwtModule, PassportModule], // Cosas que queremos usar en otros módulos
})
export class AuthModule {}
