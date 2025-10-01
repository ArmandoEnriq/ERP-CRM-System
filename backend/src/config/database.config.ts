/* Configuración completa de TypeORM y PostgreSQL

Conexión: Host, puerto, credenciales de base de datos
Pool de conexiones: Mínimas/máximas conexiones simultáneas
SSL: Configuración de seguridad para producción
Migraciones: Rutas y configuración automática
Cache: Integración con Redis para optimización
Logging: Control de logs de queries SQL
Entidades: Carga automática de todas las entidades */

import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
  'database',
  (): Partial<TypeOrmModuleOptions> => ({
    type: 'postgres',
    host: process.env.DATABASE_HOST ?? 'database',
    port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    username: process.env.DATABASE_USERNAME ?? 'postgres',
    password: process.env.DATABASE_PASSWORD ?? 'password',
    database: process.env.DATABASE_NAME ?? 'erp_crm_db',
    schema: process.env.DATABASE_SCHEMA ?? 'public',
    synchronize:
      process.env.NODE_ENV === 'development' &&
      process.env.DATABASE_SYNC === 'true',
    logging:
      process.env.DATABASE_LOGGING === 'true' ||
      process.env.NODE_ENV === 'development',
    autoLoadEntities: true,
    migrations: ['dist/database/migrations/*{.ts,.js}'],
    migrationsRun: process.env.DATABASE_RUN_MIGRATIONS === 'true',
    migrationsTableName: 'app_migrations',
    entities: ['dist/**/*.entity{.ts,.js}'],
    subscribers: ['dist/**/*.subscriber{.ts,.js}'],
  }),
);
