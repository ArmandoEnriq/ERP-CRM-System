import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

// Configuraciones
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import cacheConfig from './config/cache.config';
import emailConfig from './config/email.config';
import { validationSchema } from './config/validation.schema';

// Módulos principales
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { CommonModule } from './common/common.module';

// Guards, Filters, Interceptors y Pipes globales
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';
import { AuthExceptionFilter } from './auth/filters/auth-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ValidationPipe } from './common/pipes/validation.pipe';

// Controlador principal
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // Configuración global, aqui injectamos todas las configuraciones para el configservice
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, authConfig, cacheConfig, emailConfig],
      validationSchema,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),

    // Base de datos
    DatabaseModule,

    // Cache Redis
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('cache'),
      }),
      inject: [ConfigService],
      isGlobal: true,
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: Number(configService.get('RATE_LIMIT_TTL', 60000)),
            limit: Number(configService.get('RATE_LIMIT_MAX', 100)),
          },
        ],
      }),
    }),

    // Módulos de funcionalidad
    CommonModule,
    AuthModule,
    UsersModule,
    CompaniesModule,

    // Aquí se agregarán los módulos CRM y ERP en las siguientes fases
  ],
  controllers: [AppController],
  providers: [
    AppService,

    // Guards globales (orden importa)
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },

    // Filters globales (orden importa)
    {
      provide: APP_FILTER,
      useClass: AuthExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },

    // Interceptors globales
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },

    // Pipes globales
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
