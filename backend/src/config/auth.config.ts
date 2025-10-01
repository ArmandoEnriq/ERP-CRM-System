/* Configuración de seguridad y autenticación

JWT: Secretos, tiempos de expiración, issuer/audience
Contraseñas: Rounds de hash, requisitos de complejidad
Sesiones: Límites concurrentes, timeouts
Seguridad: Intentos de login, bloqueos automáticos
OAuth: Preparado para Google/Microsoft (futuro)
Tokens: Refresh tokens y reset de contraseñas (futuro) */

import { registerAs } from '@nestjs/config'; // Creamos un namespace para la configuración "auth"

export default registerAs('auth', () => ({
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET, // llave de autenticación para fimar el token de autenticación (usuario logueado)
    expiresIn: process.env.JWT_EXPIRATION || '7d', // tiempo de expiración
    // secret para el refresh token
    refreshSecret: process.env.JWT_REFRESH_SECRET, // token de autenticación para el refresh
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '30d', // tiempo de expiración
    issuer: process.env.JWT_ISSUER || 'erp-crm-system', // credencial del token que proviene de la app
    audience: process.env.JWT_AUDIENCE || 'erp-crm-users', // credencial del token que verifica quien puede usar el token
  },

  // Password Configuration (como se van a encriptar las contraseñas y almacenarlas)
  password: {
    saltRounds: parseInt(process.env.PASSWORD_SALT_ROUNDS, 10) || 12, // numero de rondas que se usan para encriptar la contraseñas (hashearlas)
    minLength: parseInt(process.env.PASSWORD_MIN_LENGTH, 10) || 8, // longitud mínima de la contraseñas
    requireUppercase: process.env.PASSWORD_REQUIRE_UPPERCASE !== 'false', // requiere minimo una letra mayuscula
    requireLowercase: process.env.PASSWORD_REQUIRE_LOWERCASE !== 'false', // requiere minimo una letra minuscula
    requireNumbers: process.env.PASSWORD_REQUIRE_NUMBERS !== 'false', // requiere minimo un numero
    requireSpecialChars: process.env.PASSWORD_REQUIRE_SPECIAL !== 'false', // requiere minimo un caracter especial
  },

  // Session Configuration (controlamos las sesiones que puede tener un usuario)
  session: {
    // limite maximo de sesiones concurrentes que puede tener un usuario
    maxConcurrentSessions:
      parseInt(process.env.MAX_CONCURRENT_SESSIONS, 10) || 5,
    // tiempo de expiración de las sesiones
    sessionTimeout:
      parseInt(process.env.SESSION_TIMEOUT, 10) || 24 * 60 * 60 * 1000, // 24 horas
  },

  // configuración de seguridad para el login
  security: {
    maxLoginAttempts: parseInt(process.env.MAX_LOGIN_ATTEMPTS, 10) || 5, // numero maximo de intentos fallidos para bloquearse temporalmente
    // tiempo de bloqueo
    lockoutDuration:
      parseInt(process.env.LOCKOUT_DURATION, 10) || 30 * 60 * 1000, // 30 minutos
    enableTwoFactor: process.env.ENABLE_TWO_FACTOR === 'true', // habilitar 2FA (doble autenticación)
    // tiempo de expiración del token de reset de contraseña
    passwordResetExpiration:
      parseInt(process.env.PASSWORD_RESET_EXPIRATION, 10) || 60 * 60 * 1000, // 1 hora
    // tiempo de expiración del token de verificación de correo para registro
    emailVerificationExpiration:
      parseInt(process.env.EMAIL_VERIFICATION_EXPIRATION, 10) ||
      24 * 60 * 60 * 1000, // 24 horas
  },

  // OAuth Configuration (para futuras integraciones)
  oauth: {
    google: {
      // configuración para iniciar sesión con Google
      clientId: process.env.GOOGLE_CLIENT_ID, // identificador del proveedor ( backend  + frontend)
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // secret del proveedor (solo par backend)
      enabled: process.env.GOOGLE_OAUTH_ENABLED === 'true', // habilitar el login con Google
    },
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      enabled: process.env.MICROSOFT_OAUTH_ENABLED === 'true',
    },
  },
}));
