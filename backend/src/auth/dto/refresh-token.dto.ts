import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString({ message: 'El refresh token es requerido' })
  refreshToken: string;
}
