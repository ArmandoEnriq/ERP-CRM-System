/* Entidad base que heredan todas las tablas

Campos comunes para todas las entidades (users, orders, products,etc): id (UUID), timestamps, soft delete
Auditoría: quién creó/modificó/eliminó cada registro
Control de estado: isActive para soft delete
Versionado: Control de concurrencia optimista
Metadatos: Campo JSONB para datos adicionales*/

import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  BaseEntity as TypeOrmBaseEntity,
} from 'typeorm'; // Decoradores de TypeORM

export abstract class BaseEntity extends TypeOrmBaseEntity {
  // Clase abstracta (no se puede crear una instancia de ella) que hereda de TypeOrmBaseEntity (propiedades y metodos de TypeORM)
  @PrimaryGeneratedColumn('uuid') // Decorador para la clave primaria ID
  id: string;

  @CreateDateColumn({
    // Decorador para la fecha de creación
    type: 'timestamp with time zone', // Tipo de dato timestamp con zona horaria (2000-01-01T00:00:00Z)
    default: () => 'CURRENT_TIMESTAMP', // Valor por defecto es la fecha y hora actual
  })
  createdAt: Date; // Se almacena como createdAt del tipo Date

  @UpdateDateColumn({
    // Decorador para la fecha de actualización
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP', // Actualizar la fecha de actualización en cada actualización
  })
  updatedAt: Date;

  @DeleteDateColumn({
    // Decorador para la fecha de eliminación
    type: 'timestamp with time zone',
    nullable: true, // Puede ser nulo
  })
  deletedAt?: Date;

  @Column({
    // Decorador para el usuario que creo el registro
    type: 'uuid',
    nullable: true,
    comment: 'Usuario que creó el registro',
  })
  createdBy?: string;

  @Column({
    // Decorador para el usuario que actualizo el registro
    type: 'uuid',
    nullable: true,
    comment: 'Usuario que actualizó el registro por última vez',
  })
  updatedBy?: string;

  @Column({
    // Decorador para el usuario que elimino el registro
    type: 'uuid',
    nullable: true,
    comment: 'Usuario que eliminó el registro',
  })
  deletedBy?: string;

  @Column({
    // Decorador para el estado del registro
    type: 'boolean',
    default: true,
    comment: 'Indica si el registro está activo',
  })
  isActive: boolean;

  @Column({
    // Decorador para metadatos adicionales (flexible para almacenar cualquier dato)
    type: 'jsonb',
    nullable: true,
    comment: 'Metadatos adicionales del registro',
  })
  metadata?: Record<string, any>;

  @Column({
    // Decorador para la versión del registro
    type: 'int',
    default: 1,
    comment: 'Versión del registro para control de concurrencia optimista',
  })
  version: number;
}
