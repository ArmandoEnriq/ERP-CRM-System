/* Configuración de emails (SMTP)

SMTP: Servidor, puerto, autenticación
Templates: Sistema de plantillas con Handlebars
Rate limiting: Límite de emails por hora
Queue: Sistema de cola para envío asíncrono
Configuración SSL/TLS */

import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  // namespace para la configuración de emails "email"
  // SMTP Configuration
  transport: {
    // configuración de SMTP
    host: process.env.EMAIL_HOST || 'localhost', // dirección del servidor (en producción debe ser un dominio smtp.gmail.com, etc)
    port: parseInt(process.env.EMAIL_PORT, 10) || 587, // puerto estandar para TLS
    secure: process.env.EMAIL_SECURE === 'true', // si EMAIL_SECURE es true usamos el puerto 465 mas seguro
    auth: {
      // credenciales del servidor SMTP
      user: process.env.EMAIL_USER, // nombre de usuario
      pass: process.env.EMAIL_PASSWORD, // contraseña
    },
    tls: {
      // verificación de certificados TLS si es true es necesario y si es false puede ser uno autofirmado
      rejectUnauthorized: process.env.EMAIL_TLS_REJECT_UNAUTHORIZED !== 'false',
    },
  },

  // Default sender
  defaults: {
    from: process.env.EMAIL_FROM || '"ERP/CRM System" <noreply@erp-crm.com>', // direccion de envío (nombre y direccion de envío nuestro)
    replyTo: process.env.EMAIL_REPLY_TO, // direccion de respuesta rapida para los usuarios
  },

  // Templates (sistema de plantillas con Handlebars)
  templates: {
    dir: process.env.EMAIL_TEMPLATES_DIR || 'src/templates/email', // directorio de las plantillas
    adapter: 'handlebars', // motor de plantillas
    options: {
      strict: true, // lanzara un error si la plantilla no existe o una variable no se encuentra
    },
  },

  // rango de emails por hora
  rateLimit: {
    max: parseInt(process.env.EMAIL_RATE_LIMIT_MAX, 10) || 10, // emails por hora por usuario
    windowMs:
      parseInt(process.env.EMAIL_RATE_LIMIT_WINDOW, 10) || 60 * 60 * 1000, // 1 hora en intervalo
  },

  // Queue configuration (para envío asíncrono)
  queue: {
    enabled: process.env.EMAIL_QUEUE_ENABLED === 'true', // habilitar la cola para envío asíncrono
    attempts: parseInt(process.env.EMAIL_QUEUE_ATTEMPTS, 10) || 3, // intentos de envío si falla
    backoff: {
      // forma de reintentos de envío
      type: 'exponential', // exponencial (2,4,8,16,etc)
      delay: 2000, // empieza en 2 segundos
    },
  },
}));
