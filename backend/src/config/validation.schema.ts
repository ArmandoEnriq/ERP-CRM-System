/* Validación de variables de entorno con Joi

Validación estricta: Todos los .env requeridos
Tipos de datos: Números, booleanos, strings
Valores por defecto: Si no se especifica
Rangos válidos: Puertos, conexiones, timeouts
Formatos: Emails, URLs, secretos JWT */

import * as Joi from 'joi'; // Importamos Joi para variables de entorno

export const validationSchema = Joi.object({
  // App Configuration
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  APP_NAME: Joi.string().default('ERP/CRM System'),
  GLOBAL_PREFIX: Joi.string().default('api/v1'),

  // Database Configuration
  DATABASE_HOST: Joi.string().required().default('database'),
  DATABASE_PORT: Joi.number().port().default(5432),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  DATABASE_SCHEMA: Joi.string().default('public'),
  DATABASE_SSL: Joi.string().valid('true', 'false').default('false'),
  DATABASE_SYNC: Joi.string().valid('true', 'false').default('false'),
  DATABASE_LOGGING: Joi.string().valid('true', 'false').default('false'),
  DATABASE_MAX_CONNECTIONS: Joi.number().min(1).default(10),
  DATABASE_MIN_CONNECTIONS: Joi.number().min(1).default(1),

  // Redis Configuration
  REDIS_HOST: Joi.string().default('redis'),
  REDIS_PORT: Joi.number().port().default(6379),
  REDIS_PASSWORD: Joi.string().allow('').optional(),
  REDIS_DB: Joi.number().min(0).default(0),
  REDIS_CACHE_DB: Joi.number().min(0).default(0),

  // JWT Configuration
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('30d'),

  // Security Configuration
  MAX_LOGIN_ATTEMPTS: Joi.number().min(1).default(5),
  LOCKOUT_DURATION: Joi.number().min(60000).default(1800000), // mínimo 1 minuto
  PASSWORD_SALT_ROUNDS: Joi.number().min(10).max(15).default(12),
  PASSWORD_MIN_LENGTH: Joi.number().min(6).default(8),

  // Rate Limiting
  RATE_LIMIT_TTL: Joi.number().min(1000).default(60000),
  RATE_LIMIT_MAX: Joi.number().min(1).default(100),

  // File Upload
  MAX_FILE_SIZE: Joi.number().min(1024).default(10485760), // mínimo 1KB
  ALLOWED_MIME_TYPES: Joi.string().optional(),

  // CORS
  CORS_ORIGIN: Joi.string().optional(),

  // Email Configuration
  EMAIL_HOST: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  EMAIL_PORT: Joi.number().port().default(587),
  EMAIL_SECURE: Joi.string().valid('true', 'false').default('false'),
  EMAIL_USER: Joi.string().email().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  EMAIL_PASSWORD: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  EMAIL_FROM: Joi.string().email().optional(),

  // Cache Configuration
  CACHE_TTL: Joi.number().min(1).default(300),
  USER_SESSION_TTL: Joi.number().min(300).default(86400),

  // Swagger Configuration
  SWAGGER_ENABLED: Joi.string().valid('true', 'false').default('true'),
  SWAGGER_PATH: Joi.string().default('docs'),

  // Timezone
  TZ: Joi.string().default('America/Mexico_City'),
});
