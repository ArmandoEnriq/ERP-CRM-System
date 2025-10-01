import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsUUID,
  IsBoolean,
  IsObject,
  IsArray,
  IsDateString,
  IsNumber,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { UserRole, UserStatus } from '../entities/user.entity';

export class CreateUserDto {
  @IsString({ message: 'El nombre es requerido' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @Transform(({ value }) => value?.trim())
  firstName: string;

  @IsString({ message: 'El apellido es requerido' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  @Transform(({ value }) => value?.trim())
  lastName: string;

  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsString({ message: 'La contraseña es requerida' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'La contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial',
  })
  password: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Formato de teléfono inválido' })
  phone?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsEnum(UserRole, { message: 'Rol inválido' })
  @IsOptional()
  role?: UserRole = UserRole.USER;

  @IsEnum(UserStatus, { message: 'Estado inválido' })
  @IsOptional()
  status?: UserStatus = UserStatus.ACTIVE;

  @IsOptional()
  @IsUUID(4, { message: 'ID de empresa inválido' })
  companyId?: string;

  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean = false;

  @IsOptional()
  @IsBoolean()
  mustChangePassword?: boolean = false;

  @IsOptional()
  @IsObject()
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

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsDateString()
  hireDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(9999999.99)
  salary?: number;

  @IsOptional()
  @IsUUID(4, { message: 'ID de supervisor inválido' })
  supervisorId?: string;
}
