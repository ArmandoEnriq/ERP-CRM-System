/* Tabla para reset de contraseñas

Tokens seguros: Hasheados, con expiración
Rastreo: IP de origen, fechas de uso
Control de uso único: No reutilización de tokens
Auditoría: Registro completo de solicitudes */

import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('password_resets')
@Index(['token'], { unique: true })
@Index(['userId', 'isActive'])
export class PasswordReset extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 500,
    comment: 'Token de reseteo hasheado',
  })
  token: string;

  @Column({
    type: 'uuid',
    comment: 'ID del usuario que solicita el reset',
  })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'varchar',
    length: 45,
    comment: 'IP desde donde se solicitó el reset',
    nullable: true,
  })
  requestedFromIp?: string;

  @Column({
    type: 'timestamp with time zone',
    comment: 'Fecha de expiración del token',
  })
  expiresAt: Date;

  @Column({
    type: 'timestamp with time zone',
    nullable: true,
    comment: 'Fecha cuando se usó el token',
  })
  usedAt?: Date;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Indica si el token ya fue utilizado',
  })
  isUsed: boolean;
}
