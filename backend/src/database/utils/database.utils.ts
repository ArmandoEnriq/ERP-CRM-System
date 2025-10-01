/* Utilidades para base de datos

Paginación: Aplicar límites y offsets
Búsqueda: Filtros LIKE inteligentes
Validaciones: UUIDs, formatos
Cache keys: Generación consistente
Sanitización: Prevención de inyección SQL */

import { SelectQueryBuilder } from 'typeorm';
import { PaginationOptions } from '../interfaces/pagination.interface';

/**
 * Aplicar filtros de búsqueda a un QueryBuilder
 */
export function applySearchFilter<T>(
  queryBuilder: SelectQueryBuilder<T>,
  search: string,
  searchFields: string[],
  alias: string = 'entity',
): void {
  if (!search || !searchFields.length) {
    return;
  }

  const searchConditions = searchFields
    .map((field, index) => `${alias}.${field} ILIKE :search${index}`)
    .join(' OR ');

  queryBuilder.andWhere(`(${searchConditions})`);

  searchFields.forEach((_, index) => {
    queryBuilder.setParameter(`search${index}`, `%${search}%`);
  });
}

/**
 * Aplicar paginación a un QueryBuilder
 */
export function applyPagination<T>(
  queryBuilder: SelectQueryBuilder<T>,
  options: PaginationOptions,
): void {
  const { page = 1, limit = 20 } = options;
  const offset = (page - 1) * limit;

  queryBuilder.skip(offset).take(limit);
}

/**
 * Aplicar ordenamiento a un QueryBuilder
 */
export function applySorting<T>(
  queryBuilder: SelectQueryBuilder<T>,
  sortBy: string = 'createdAt',
  sortOrder: 'ASC' | 'DESC' = 'DESC',
  alias: string = 'entity',
): void {
  queryBuilder.orderBy(`${alias}.${sortBy}`, sortOrder);
}

/**
 * Generar código único para entidades
 */
export function generateEntityCode(prefix: string, sequence: number): string {
  const paddedSequence = sequence.toString().padStart(6, '0');
  return `${prefix}-${paddedSequence}`;
}

/**
 * Sanitizar datos para prevenir inyección SQL
 */
export function sanitizeSearchTerm(searchTerm: string): string {
  return searchTerm
    .replace(/[^\w\s-]/g, '') // Remover caracteres especiales excepto guiones
    .trim()
    .substring(0, 100); // Limitar longitud
}

/**
 * Construir condiciones WHERE dinámicas
 */
export function buildDynamicWhere(
  filters: Record<string, any>,
  alias: string = 'entity',
): {
  where: string;
  parameters: Record<string, any>;
} {
  const conditions: string[] = [];
  const parameters: Record<string, any> = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      const paramKey = `filter_${key}`;

      if (typeof value === 'string' && value.includes('%')) {
        conditions.push(`${alias}.${key} ILIKE :${paramKey}`);
      } else if (Array.isArray(value)) {
        conditions.push(`${alias}.${key} IN (:...${paramKey})`);
      } else {
        conditions.push(`${alias}.${key} = :${paramKey}`);
      }

      parameters[paramKey] = value;
    }
  });

  return {
    where: conditions.length > 0 ? conditions.join(' AND ') : '1=1',
    parameters,
  };
}

/**
 * Validar UUID
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Formatear fecha para base de datos
 */
export function formatDateForDB(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toISOString();
}

/**
 * Generar hash para cache key
 */
export function generateCacheKey(
  prefix: string,
  ...parts: (string | number)[]
): string {
  return `${prefix}:${parts.join(':')}`;
}
