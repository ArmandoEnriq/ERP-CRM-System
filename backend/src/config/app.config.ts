/* Configuración general de la aplicación
Información básica: Nombre, versión, descripción del sistema
Servidor: Puerto, prefijo global de API (/api/v1)
CORS: Configuración de orígenes permitidos para el frontend
Rate Limiting: Límites de requests por minuto (anti-spam)
File Upload: Tamaños máximos y tipos de archivos permitidos
Paginación: Límites por defecto y máximos para listados
Swagger: Configuración de la documentación automática */

import { registerAs } from '@nestjs/config'; // Creamos un namespace para la configuración

export default registerAs('app', () => ({
  // Exportamos la configuración con el namespace 'app'
  name: process.env.APP_NAME || 'ERP/CRM System', // Obtenemos los valores de las variables de entorno nombre de la app
  version: process.env.APP_VERSION || '1.0.0', // version de la app
  description: process.env.APP_DESCRIPTION || 'Sistema ERP/CRM Full-Stack', // Descripción de la app
  environment: process.env.NODE_ENV || 'development', // Entorno de la app
  port: parseInt(process.env.PORT, 10) || 3000, // Convertimos el puerto a entero (con el 10)
  globalPrefix: process.env.GLOBAL_PREFIX || 'api', // Prefijo global de la API

  // Configuración de CORS
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || [
      // usamos env variable para permitir multiples orígenes y sino las por defecto
      'http://localhost:3000',
      'http://localhost:5173',
    ],
    credentials: true, // Habilitamos las cookies
  },

  // Limitador de peticiones
  rateLimit: {
    ttl: parseInt(process.env.RATE_LIMIT_TTL, 10) || 60000, // 1 minuto
    limit: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100, // 100 requests por minuto
  }, // Usamos env variable para definir el tiempo y peticiones por cliente

  // subida de archivos
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10 * 1024 * 1024, // maximo 10MB
    allowedMimeTypes: process.env.ALLOWED_MIME_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ], // Tipos de archivos permitidos usamos env variable y sino los por defecto
  },

  // listado por paginas
  pagination: {
    defaultLimit: parseInt(process.env.DEFAULT_PAGE_SIZE, 10) || 20, // por defecto 20 por pagina
    maxLimit: parseInt(process.env.MAX_PAGE_SIZE, 10) || 100, // maximo 100
  },

  // Zona horaria
  timezone: process.env.TZ || 'America/Mexico_City',

  // Documentación automática de la API
  swagger: {
    // Uxamos swagger para la documentación
    enabled: process.env.SWAGGER_ENABLED !== 'false', // Verificamos si esta activado (desactiva para produción)
    title: process.env.SWAGGER_TITLE || 'ERP/CRM API', // titulo de la documentación
    description:
      process.env.SWAGGER_DESCRIPTION || 'API Documentation for ERP/CRM System', // Descripción de la documentación
    version: process.env.SWAGGER_VERSION || '1.0', // Version de la documentación
    path: process.env.SWAGGER_PATH || 'docs', // Ruta de la documentación
  },
}));
