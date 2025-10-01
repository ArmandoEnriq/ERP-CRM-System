import { IsString, MinLength, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsString({ message: 'La contraseña actual es requerida' })
  currentPassword: string;

  @IsString({ message: 'La nueva contraseña es requerida' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'La contraseña debe contener al menos: 1 minúscula, 1 mayúscula, 1 número y 1 carácter especial',
  })
  newPassword: string;
}
