/* Decoradores especializados para campos

@MoneyColumn: Campos monetarios con precisión decimal
@EmailColumn: Emails con validación
@CodeColumn: Códigos únicos
@Searchable: Campos para búsqueda full-text */

import { SetMetadata } from '@nestjs/common';
import { Column, ColumnOptions, Index, IndexOptions } from 'typeorm';

// Decorador para campos de auditoría
export const AUDIT_METADATA_KEY = 'audit';
export const Auditable = () => SetMetadata(AUDIT_METADATA_KEY, true);

// Decorador para campos de búsqueda de texto completo
export const SEARCHABLE_METADATA_KEY = 'searchable';
export const Searchable = (weight: 'A' | 'B' | 'C' | 'D' = 'B') =>
  SetMetadata(SEARCHABLE_METADATA_KEY, weight);

// Decorador para campos monetarios con configuración estándar
export function MoneyColumn(options?: Partial<ColumnOptions>) {
  return Column({
    type: 'decimal',
    precision: 15,
    scale: 2,
    default: 0,
    ...options,
  });
}

// Decorador para campos de porcentaje
export function PercentageColumn(options?: Partial<ColumnOptions>) {
  return Column({
    type: 'decimal',
    precision: 5,
    scale: 4,
    default: 0,
    ...options,
  });
}

// Decorador para campos de cantidad
export function QuantityColumn(options?: Partial<ColumnOptions>) {
  return Column({
    type: 'decimal',
    precision: 12,
    scale: 4,
    default: 0,
    ...options,
  });
}

// Decorador para índices de texto completo
export function FullTextIndex(name?: string, options?: Partial<IndexOptions>) {
  return Index(
    name,
    options ? { ...options, fulltext: true } : { fulltext: true },
  );
}

// Decorador para campos de código único
export function CodeColumn(
  maxLength: number = 50,
  options?: Partial<ColumnOptions>,
) {
  return Column({
    type: 'varchar',
    length: maxLength,
    unique: true,
    ...options,
  });
}

// Decorador para campos de email
export function EmailColumn(options?: Partial<ColumnOptions>) {
  return Column({
    type: 'varchar',
    length: 320,
    ...options,
  });
}
