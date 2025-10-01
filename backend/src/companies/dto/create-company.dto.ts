import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
  Matches,
  IsObject,
  IsDateString,
  IsNumber,
  Min,
  Max,
  IsBoolean,
  IsUrl,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { CompanyStatus, CompanySize } from '../entities/company.entity';

export class CreateCompanyDto {
  @IsString({ message: 'El nombre de la empresa es requerido' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(255, { message: 'El nombre no puede exceder 255 caracteres' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  tradeName?: string;

  @IsString({ message: 'El RFC es requerido' })
  @Matches(/^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$/, {
    message: 'Formato de RFC inválido',
  })
  @Transform(({ value }) => value?.toUpperCase().trim())
  rfc: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  industry?: string;

  @IsOptional()
  @IsEnum(CompanySize)
  size?: CompanySize;

  @IsOptional()
  @IsEnum(CompanyStatus)
  status?: CompanyStatus = CompanyStatus.ACTIVE;

  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Formato de teléfono inválido' })
  phone?: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL del sitio web inválida' })
  website?: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL del logo inválida' })
  logo?: string;

  // Dirección
  @IsOptional()
  @IsString()
  @MaxLength(255)
  street?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  neighborhood?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{5}$/, { message: 'Código postal debe tener 5 dígitos' })
  postalCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  // Suscripción
  @IsOptional()
  @IsString()
  subscriptionPlan?: string = 'basic';

  @IsOptional()
  @IsDateString()
  subscriptionExpiresAt?: string;

  @IsOptional()
  @IsBoolean()
  subscriptionActive?: boolean = true;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000)
  maxUsers?: number = 10;

  // Configuraciones
  @IsOptional()
  @IsObject()
  settings?: {
    timezone?: string;
    language?: string;
    currency?: string;
    dateFormat?: string;
    numberFormat?: string;
    fiscalYear?: {
      startMonth: number;
      endMonth: number;
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

  // Información fiscal
  @IsOptional()
  @IsString()
  @MaxLength(100)
  taxRegime?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  defaultTaxRate?: number;

  // Fechas
  @IsOptional()
  @IsDateString()
  foundedAt?: string;

  // Contacto principal
  @IsOptional()
  @IsString()
  @MaxLength(200)
  contactName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  contactPosition?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email del contacto inválido' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  contactEmail?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Formato de teléfono del contacto inválido',
  })
  contactPhone?: string;
}
