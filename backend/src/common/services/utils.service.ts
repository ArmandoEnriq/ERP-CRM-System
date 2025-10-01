import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class UtilsService {
  /**
   * Generar código aleatorio
   */
  generateCode(length: number = 8): string {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length)
      .toUpperCase();
  }

  /**
   * Generar slug desde texto
   */
  generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remover caracteres especiales
      .replace(/[\s_-]+/g, '-') // Reemplazar espacios y guiones múltiples
      .replace(/^-+|-+$/g, ''); // Remover guiones al inicio y final
  }

  /**
   * Formatear número como moneda
   */
  formatCurrency(amount: number, currency: string = 'MXN'): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency,
    }).format(amount);
  }

  /**
   * Formatear fecha
   */
  formatDate(date: Date, locale: string = 'es-MX'): string {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }

  /**
   * Calcular diferencia en días entre fechas
   */
  daysBetween(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
  }

  /**
   * Sanitizar texto para búsqueda
   */
  sanitizeSearchTerm(term: string): string {
    return term
      .trim()
      .toLowerCase()
      .replace(/[^\w\s]/gi, '');
  }

  /**
   * Validar RFC mexicano
   */
  validateRFC(rfc: string): boolean {
    const rfcRegex = /^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$/;
    return rfcRegex.test(rfc.toUpperCase());
  }

  /**
   * Validar CURP mexicano
   */
  validateCURP(curp: string): boolean {
    const curpRegex =
      /^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}[0-1][0-9][0-3][0-9][HM]{1}[AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TL|TS|VZ|YN|ZS|NE]{2}[0-9A-Z]{2}$/;
    return curpRegex.test(curp.toUpperCase());
  }
}
