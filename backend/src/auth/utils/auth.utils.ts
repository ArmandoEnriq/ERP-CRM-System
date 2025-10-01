import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

/**
 * Generar token seguro
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generar hash de token
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Verificar fortaleza de contraseña
 */
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  // Longitud mínima
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Debe tener al menos 8 caracteres');
  }

  // Contiene minúsculas
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Debe contener al menos una letra minúscula');
  }

  // Contiene mayúsculas
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Debe contener al menos una letra mayúscula');
  }

  // Contiene números
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Debe contener al menos un número');
  }

  // Contiene caracteres especiales
  if (/[@$!%*?&]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Debe contener al menos un carácter especial (@$!%*?&)');
  }

  // Puntuación adicional por longitud
  if (password.length >= 12) {
    score += 1;
  }

  return { score, feedback };
}

/**
 * Extraer información del User-Agent
 */
export function parseUserAgent(userAgent: string): {
  browser: string;
  os: string;
  device: string;
} {
  // Implementación simple - en producción usar una librería como ua-parser-js
  let browser = 'Unknown';
  let os = 'Unknown';
  let device = 'Desktop';

  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Edge')) browser = 'Edge';

  if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Mac')) os = 'macOS';
  else if (userAgent.includes('Linux')) os = 'Linux';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iOS')) os = 'iOS';

  if (userAgent.includes('Mobile') || userAgent.includes('Android')) {
    device = 'Mobile';
  } else if (userAgent.includes('Tablet') || userAgent.includes('iPad')) {
    device = 'Tablet';
  }

  return { browser, os, device };
}

/**
 * Validar dirección IP
 */
export function isValidIP(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

/**
 * Generar código de verificación numérico
 */
export function generateVerificationCode(length: number = 6): string {
  const digits = '0123456789';
  let code = '';

  for (let i = 0; i < length; i++) {
    code += digits.charAt(Math.floor(Math.random() * digits.length));
  }

  return code;
}

/**
 * Calcular tiempo hasta expiración
 */
export function getTimeUntilExpiration(expiresAt: Date): {
  expired: boolean;
  timeLeft: number;
  humanReadable: string;
} {
  const now = new Date().getTime();
  const expiration = expiresAt.getTime();
  const timeLeft = expiration - now;

  if (timeLeft <= 0) {
    return {
      expired: true,
      timeLeft: 0,
      humanReadable: 'Expirado',
    };
  }

  const minutes = Math.floor(timeLeft / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let humanReadable = '';
  if (days > 0) {
    humanReadable = `${days} día${days > 1 ? 's' : ''}`;
  } else if (hours > 0) {
    humanReadable = `${hours} hora${hours > 1 ? 's' : ''}`;
  } else {
    humanReadable = `${minutes} minuto${minutes > 1 ? 's' : ''}`;
  }

  return {
    expired: false,
    timeLeft,
    humanReadable,
  };
}
