import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { Exclude } from 'class-transformer';
import { Company } from '../../companies/entities/company.entity';
import { UserSession } from '../../auth/entities/user-session.entity';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
}

@Entity('users')
@Index(['email'], { unique: true })
@Index(['companyId', 'isActive'])
@Index(['role', 'isActive'])
@Index(['status', 'isActive'])
export class User extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 100,
    comment: 'Nombre del usuario',
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 100,
    comment: 'Apellido del usuario',
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 320,
    unique: true,
    comment: 'Email del usuario (único)',
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'Contraseña hasheada',
  })
  @Exclude()
  password: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'Número de teléfono',
  })
  phone?: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'URL del avatar del usuario',
  })
  avatar?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
    comment: 'Rol del usuario en el sistema',
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
    comment: 'Estado del usuario',
  })
  status: UserStatus;

  @Column({
    type: 'uuid',
    nullable: true,
    comment: 'ID de la empresa a la que pertenece el usuario',
  })
  companyId?: string;

  @ManyToOne(() => Company, company => company.users, { nullable: true })
  @JoinColumn({ name: 'company_id' })
  company?: Company;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Indica si el email ha sido verificado',
  })
  isEmailVerified: boolean;

  @Column({
    type: 'timestamp with time zone',
    nullable: true,
    comment: 'Fecha de verificación del email',
  })
  emailVerifiedAt?: Date;

  @Column({
    type: 'timestamp with time zone',
    nullable: true,
    comment: 'Fecha del último inicio de sesión',
  })
  lastLoginAt?: Date;

  @Column({
    type: 'varchar',
    length: 45,
    nullable: true,
    comment: 'Última IP desde la que se conectó',
  })
  lastLoginIp?: string;

  @Column({
    type: 'int',
    default: 0,
    comment: 'Número de intentos de login fallidos',
  })
  loginAttempts: number;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Indica si la cuenta está bloqueada',
  })
  isLocked: boolean;

  @Column({
    type: 'timestamp with time zone',
    nullable: true,
    comment: 'Fecha hasta la que está bloqueada la cuenta',
  })
  lockExpiresAt?: Date;

  @Column({
    type: 'timestamp with time zone',
    nullable: true,
    comment: 'Fecha del último cambio de contraseña',
  })
  passwordChangedAt?: Date;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Indica si debe cambiar la contraseña en el próximo login',
  })
  mustChangePassword: boolean;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Indica si tiene habilitada la autenticación de dos factores',
  })
  twoFactorEnabled: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Secret para 2FA',
  })
  @Exclude()
  twoFactorSecret?: string;

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Configuraciones del usuario',
  })
  settings?: {
    language?: string;
    timezone?: string;
    notifications?: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
    };
    theme?: 'light' | 'dark';
    dateFormat?: string;
    numberFormat?: string;
  };

  @Column({
    type: 'jsonb',
    nullable: true,
    comment: 'Permisos específicos del usuario',
  })
  permissions?: string[];

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Biografía o descripción del usuario',
  })
  bio?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Posición o cargo del usuario',
  })
  position?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: 'Departamento al que pertenece',
  })
  department?: string;

  @Column({
    type: 'date',
    nullable: true,
    comment: 'Fecha de contratación',
  })
  hireDate?: Date;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    comment: 'Salario del usuario',
  })
  salary?: number;

  @Column({
    type: 'uuid',
    nullable: true,
    comment: 'ID del supervisor directo',
  })
  supervisorId?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'supervisor_id' })
  supervisor?: User;

  @OneToMany(() => User, user => user.supervisor)
  subordinates: User[];

  @OneToMany(() => UserSession, session => session.user)
  sessions: UserSession[];

  // Getters virtuales
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get initials(): string {
    return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`.toUpperCase();
  }

  get isAdmin(): boolean {
    return [UserRole.SUPER_ADMIN, UserRole.ADMIN].includes(this.role);
  }

  get canManageUsers(): boolean {
    return [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER].includes(
      this.role,
    );
  }
}
