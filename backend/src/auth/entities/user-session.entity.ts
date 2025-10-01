/* Tabla de sesiones activas de usuarios

Token de sesión: Hasheado por seguridad
Información del cliente: IP, User-Agent
Control de tiempo: Última actividad, expiración
Remember me: Sesiones extendidas
Metadatos: Datos adicionales de la sesión */

import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('user_sessions')
@Index(['userId', 'isActive'])
@Index(['sessionToken'], { unique: true })
export class UserSession extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 500,
    comment: 'Token de sesión hasheado',
  })
  sessionToken: string;

  @Column({
    type: 'uuid',
    comment: 'ID del usuario propietario de la sesión',
  })
  userId: string;

  @ManyToOne(() => User, user => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'varchar',
    length: 500,
    comment: 'User agent del cliente',
    nullable: true,
  })
  userAgent?: string;

  @Column({
    type: 'varchar',
    length: 45,
    comment: 'Dirección IP del cliente',
    nullable: true,
  })
  ipAddress?: string;

  @Column({
    type: 'timestamp with time zone',
    comment: 'Última actividad de la sesión',
  })
  lastActivityAt: Date;

  @Column({
    type: 'timestamp with time zone',
    comment: 'Fecha de expiración de la sesión',
  })
  expiresAt: Date;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Datos adicionales de la sesión',
  })
  sessionData?: Record<string, any>;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Indica si la sesión se mantiene activa',
  })
  rememberMe: boolean;
}
