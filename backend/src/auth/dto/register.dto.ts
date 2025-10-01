import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
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
  @Transform(({ value }) => value?.trim())
  phone?: string;
}
