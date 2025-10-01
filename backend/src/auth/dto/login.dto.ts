import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
} from 'class-validator'; // decoradores de validación
import { Transform } from 'class-transformer'; // decoradores de transformación

export class LoginDto {
  @IsEmail({}, { message: 'Debe proporcionar un email válido' }) // verificar que el email sea valido
  @Transform(({ value }) => value?.toLowerCase().trim()) // transformar el email a minusculas y sin espacios
  email: string;

  @IsString({ message: 'La contraseña es requerida' }) // es obligatorio
  @MinLength(1, { message: 'La contraseña no puede estar vacía' }) // la contraseña no puede estar vacia
  password: string;

  @IsOptional() // es opcional
  @IsBoolean() // debe ser un boolean
  rememberMe?: boolean = false; // por defecto es false
}
