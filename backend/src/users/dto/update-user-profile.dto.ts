import {
  IsString,
  IsOptional,
  MinLength,
  IsObject,
  Matches,
  IsDateString,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString({ message: 'El nombre es requerido' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @Transform(({ value }) => value?.trim())
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'El apellido es requerido' })
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  @Transform(({ value }) => value?.trim())
  lastName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Formato de teléfono inválido' })
  phone?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

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
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsString()
  department?: string;
}
