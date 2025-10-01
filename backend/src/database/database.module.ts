/* Módulo de base de datos 
Configuración de la base de datos usando TypeORM 
obtenemos la configuración de la base de datos del archivo database.config.ts y poder usarlo en otros módulos */

import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: config.getOrThrow<string>('DATABASE_HOST'),
        port: config.getOrThrow<number>('DATABASE_PORT'),
        username: config.getOrThrow<string>('DATABASE_USERNAME'),
        password: config.getOrThrow<string>('DATABASE_PASSWORD'),
        database: config.getOrThrow<string>('DATABASE_NAME'),
        schema: config.get<string>('DATABASE_SCHEMA') || 'public',
        synchronize: config.get('DATABASE_SYNC') === 'true',
        logging: config.get('DATABASE_LOGGING') === 'true',
        autoLoadEntities: true,
        migrationsRun: config.get('DATABASE_RUN_MIGRATIONS') === 'true',
        migrations: ['dist/database/migrations/*{.ts,.js}'],
        entities: ['dist/**/*.entity{.ts,.js}'],
        subscribers: ['dist/**/*.subscriber{.ts,.js}'],
        extra: {
          max: config.get<number>('DATABASE_MAX_CONNECTIONS') || 10,
          min: config.get<number>('DATABASE_MIN_CONNECTIONS') || 1,
          connectionTimeoutMillis:
            config.get<number>('DATABASE_CONNECTION_TIMEOUT') || 30000,
          idleTimeoutMillis:
            config.get<number>('DATABASE_IDLE_TIMEOUT') || 300000,
        },
        cache:
          config.get('DATABASE_CACHE') === 'true'
            ? {
                type: 'redis',
                options: {
                  host: config.get('REDIS_HOST') ?? 'redis',
                  port: config.get<number>('REDIS_PORT') || 6379,
                  password: config.get('REDIS_PASSWORD'),
                  db: config.get<number>('REDIS_DB') || 0,
                },
                duration:
                  config.get<number>('DATABASE_CACHE_DURATION') || 30000,
              }
            : false,
      }),
    }),
  ],
})
export class DatabaseModule {}
