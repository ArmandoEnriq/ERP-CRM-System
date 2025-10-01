import { SetMetadata } from '@nestjs/common';
// Define los tokens manualmente
export const THROTTLER_LIMIT = 'throttler_limit';
export const THROTTLER_TTL = 'throttler_ttl';

export const Throttle = (limit: number, ttl: number) => {
  return SetMetadata(THROTTLER_LIMIT, limit) && SetMetadata(THROTTLER_TTL, ttl);
};

// Decoradores predefinidos para casos comunes
export const ThrottleLogin = () => Throttle(5, 60000); // 5 intentos por minuto
export const ThrottleRegister = () => Throttle(3, 300000); // 3 registros por 5 minutos
export const ThrottleForgotPassword = () => Throttle(3, 300000); // 3 solicitudes por 5 minutos
export const ThrottleEmailSend = () => Throttle(10, 3600000); // 10 emails por hora
