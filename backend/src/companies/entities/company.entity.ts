import { Entity, Column, OneToMany, Index } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { User } from '../../users/entities/user.entity';

export enum CompanyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  TRIAL = 'trial',
}

export enum CompanySize {
  SMALL = 'small', // 1-10 empleados
  MEDIUM = 'medium', // 11-50 empleados
  LARGE = 'large', // 51-200 empleados
  ENTERPRISE = 'enterprise', // 200+ empleados
}

@Entity('companies')
@Index(['name'], { unique: true })
@Index(['rfc'], { unique: true })
@Index(['status', 'isActive'])
@Index(['subscriptionExpiresAt'])
export class Company extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
    comment: 'Nombre de la empresa',
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Nombre comercial de la empresa',
  })
  tradeName?: string;

  @Column({
    type: 'varchar',
    length: 13,
    unique: true,
    comment: 'RFC de la empresa',
  })
  rfc: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Descripción de la empresa',
  })
  description?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Industria o sector',
  })
  industry?: string;

  @Column({
    type: 'enum',
    enum: CompanySize,
    nullable: true,
    comment: 'Tamaño de la empresa',
  })
  size?: CompanySize;

  @Column({
    type: 'enum',
    enum: CompanyStatus,
    default: CompanyStatus.ACTIVE,
    comment: 'Estado de la empresa',
  })
  status: CompanyStatus;

  @Column({
    type: 'varchar',
    length: 320,
    nullable: true,
    comment: 'Email principal de la empresa',
  })
  email?: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Teléfono principal',
  })
  phone?: string;

  @Column({
    type: 'varchar',
    length: 2048,
    nullable: true,
    comment: 'Sitio web de la empresa',
  })
  website?: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'URL del logo de la empresa',
  })
  logo?: string;

  // Dirección
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Calle y número',
  })
  street?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Colonia',
  })
  neighborhood?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Ciudad',
  })
  city?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Estado/Provincia',
  })
  state?: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
    comment: 'Código postal',
  })
  postalCode?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'País',
  })
  country?: string;

  // Configuraciones de suscripción
  @Column({
    type: 'varchar',
    length: 50,
    default: 'basic',
    comment: 'Plan de suscripción',
  })
  subscriptionPlan: string;

  @Column({
    type: 'timestamp with time zone',
    nullable: true,
    comment: 'Fecha de expiración de la suscripción',
  })
  subscriptionExpiresAt?: Date;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Indica si la suscripción está activa',
  })
  subscriptionActive: boolean;

  @Column({
    type: 'int',
    default: 10,
    comment: 'Número máximo de usuarios permitidos',
  })
  maxUsers: number;

  @Column({
    type: 'int',
    default: 0,
    comment: 'Número actual de usuarios activos',
  })
  currentUsers: number;

  // Configuraciones del sistema
  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Configuraciones específicas de la empresa',
  })
  settings?: {
    timezone?: string;
    language?: string;
    currency?: string;
    dateFormat?: string;
    numberFormat?: string;
    fiscalYear?: {
      startMonth: number; // 1-12
      endMonth: number; // 1-12
    };
    notifications?: {
      email?: boolean;
      sms?: boolean;
      push?: boolean;
    };
    features?: {
      crm?: boolean;
      inventory?: boolean;
      accounting?: boolean;
      reports?: boolean;
    };
  };

  // Información fiscal adicional
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Régimen fiscal',
  })
  taxRegime?: string;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 4,
    nullable: true,
    comment: 'Tasa de IVA por defecto',
  })
  defaultTaxRate?: number;

  // Fechas importantes
  @Column({
    type: 'date',
    nullable: true,
    comment: 'Fecha de fundación de la empresa',
  })
  foundedAt?: Date;

  @Column({
    type: 'timestamp with time zone',
    nullable: true,
    comment: 'Fecha de registro en el sistema',
  })
  registeredAt?: Date;

  // Contacto principal
  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    comment: 'Nombre del contacto principal',
  })
  contactName?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Cargo del contacto principal',
  })
  contactPosition?: string;

  @Column({
    type: 'varchar',
    length: 320,
    nullable: true,
    comment: 'Email del contacto principal',
  })
  contactEmail?: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Teléfono del contacto principal',
  })
  contactPhone?: string;

  // Relaciones
  @OneToMany(() => User, user => user.company)
  users: User[];

  // Getters virtuales
  get fullAddress(): string {
    const parts = [
      this.street,
      this.neighborhood,
      this.city,
      this.state,
      this.postalCode,
      this.country,
    ].filter(Boolean);

    return parts.join(', ');
  }

  get isSubscriptionExpired(): boolean {
    return this.subscriptionExpiresAt
      ? this.subscriptionExpiresAt < new Date()
      : false;
  }

  get canAddMoreUsers(): boolean {
    return this.currentUsers < this.maxUsers;
  }

  get availableUserSlots(): number {
    return Math.max(0, this.maxUsers - this.currentUsers);
  }
}
