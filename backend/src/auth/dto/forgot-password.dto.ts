import { IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Debe proporcionar un email válido' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;
}
