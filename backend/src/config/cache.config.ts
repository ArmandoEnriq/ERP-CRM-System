/*Configuración de Redis para cache

Conexión Redis: Host, puerto, contraseña
TTL por tipo: Diferentes duraciones según el dato
Sesiones de usuario: 24 horas
Respuestas API: 5 minutos
Datos de reportes: 30 minutos
Datos maestros: 1 hora */

import { registerAs } from '@nestjs/config';
import { CacheModuleOptions } from '@nestjs/cache-manager';

export default registerAs(
  'cache',
  (): CacheModuleOptions => ({
    // Creamos un namespace para la configuración "cache" del tipo CacheModuleOptions (opciones de cache de nest)
    store: 'redis', // motor de cache usado
    host: process.env.REDIS_HOST || 'redis', // direccion de redis
    port: parseInt(process.env.REDIS_PORT, 10) || 6379, // puerto de redis
    password: process.env.REDIS_PASSWORD, // contraseña de redis
    db: parseInt(process.env.REDIS_CACHE_DB, 10) || 1, // base de datos numerada de redis

    // TTL por defecto en segundos (tiempo de vida de la cache) que no se especifica
    ttl: parseInt(process.env.CACHE_TTL, 10) || 300, // 5 minutos

    // Configuraciones específicas por tipo de cache
    userSession: {
      // vida de las sesiones de usuario
      ttl: parseInt(process.env.USER_SESSION_TTL, 10) || 86400, // 24 horas
    },

    apiResponse: {
      // vida de las respuestas de la API (respuestas costosas datos de terceros, consultas complejas,etc)
      ttl: parseInt(process.env.API_RESPONSE_TTL, 10) || 300, // 5 minutos
    },

    reportData: {
      // vida de los datos de reporte (consultas que requieren procesamiento intenso)
      ttl: parseInt(process.env.REPORT_DATA_TTL, 10) || 1800, // 30 minutos
    },

    masterData: {
      // vida de los datos máster (valores que no cambian con frecuencia paises,moneda,etc)
      ttl: parseInt(process.env.MASTER_DATA_TTL, 10) || 3600, // 1 hora
    },
  }),
);
