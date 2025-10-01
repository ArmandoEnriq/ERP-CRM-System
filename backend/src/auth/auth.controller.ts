/* Endpoints de autenticación

POST /auth/login: Iniciar sesión
POST /auth/register: Crear cuenta
POST /auth/logout: Cerrar sesión actual
POST /auth/logout-all: Cerrar todas las sesiones
POST /auth/refresh: Renovar tokens
POST /auth/forgot-password: Solicitar reset
POST /auth/reset-password: Cambiar contraseña
GET /auth/sessions: Ver sesiones activas */

import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Ip,
  Headers,
} from '@nestjs/common'; // para crear controladores
import { AuthGuard } from '@nestjs/passport'; // para manejar autenticación
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'; // para documentación

import { AuthService } from './auth.service'; // servicio de autenticación
import { JwtAuthGuard } from './guards/jwt-auth.guard'; // para manejar tokens
import { LocalAuthGuard } from './guards/local-auth.guard'; // para manejar credenciales
import { RefreshTokenGuard } from './guards/refresh-token.guard'; // para manejar refresh tokens

import { LoginDto } from './dto/login.dto'; // DTO de login
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

import { RequestUser } from './interfaces/auth.interface'; // interface de usuario
import { GetUser } from './decorators/get-user.decorator'; // decorator de usuario
import { Public } from './decorators/public.decorator';

@ApiTags('Authentication') // etiqueta para documentación
@Controller('auth') // controlador (http://localhost:3000/auth)
export class AuthController {
  // creamos la clase del controlador
  constructor(private readonly authService: AuthService) {} // constructor que recibe un parámetro authService ( es como crear una instancia del servicio de autenticación y la podemos usar en cualquier parte del controlador)

  @Post('register') // metodo post para registrar un usuario
  @Public()
  @ApiOperation({ summary: 'Registrar nuevo usuario' }) // etiqueta para documentación
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' }) // etiqueta para documentación respuesta exitosa
  @ApiResponse({ status: 409, description: 'Email ya registrado' }) // etiqueta para documentación respuesta de error
  async register(@Body() registerDto: RegisterDto) {
    // metodo para registrar un usuario que recibe un parámetro registerDto y se llena con los datos recibidos del body
    const user = await this.authService.register(registerDto);
    return {
      message: 'Usuario registrado exitosamente',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  @Post('login') // metodo post para iniciar sesión
  @Public()
  @UseGuards(LocalAuthGuard) // usamos el guard LocalAuthGuard (inicia sesión con email y password)
  @HttpCode(HttpStatus.OK) // cambiamos el codigo de respuesta normalmente da 201 pero lo cambiamos a 200
  @ApiOperation({ summary: 'Iniciar sesión' }) // etiqueta para documentación
  @ApiResponse({ status: 200, description: 'Login exitoso' }) // etiqueta para documentación respuesta exitosa
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' }) // etiqueta para documentación respuesta de error
  async login(
    @Body() loginDto: LoginDto,
    @Request() req,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent: string,
  ) {
    // metodo para iniciar sesión que recibe un parámetro loginDto y se llena con los datos recibidos del body y un parámetro req que se llena con los datos del request y un parámetro ipAddress que se llena con la ip del usuario y un parámetro userAgent que se llena con el navegador del usuario
    return await this.authService.login(loginDto, userAgent, ipAddress); // llamamos al servicio de autenticación
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiResponse({ status: 200, description: 'Sesión cerrada exitosamente' })
  async logout(@GetUser() user: RequestUser) {
    await this.authService.logout(user.sessionId, user.userId);
    return { message: 'Sesión cerrada exitosamente' };
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar todas las sesiones' })
  @ApiResponse({ status: 200, description: 'Todas las sesiones cerradas' })
  async logoutAll(@GetUser() user: RequestUser) {
    await this.authService.logoutAll(user.userId);
    return { message: 'Todas las sesiones han sido cerradas' };
  }

  @Post('refresh')
  @Public()
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refrescar tokens' })
  @ApiResponse({ status: 200, description: 'Tokens refrescados exitosamente' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido' })
  async refreshTokens(
    @Body() refreshTokenDto: RefreshTokenDto,
    @GetUser() user: any,
  ) {
    const tokens = await this.authService.refreshTokens(
      user.userId,
      user.sessionId,
    );
    return {
      message: 'Tokens refrescados exitosamente',
      tokens,
    };
  }

  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambiar contraseña' })
  @ApiResponse({ status: 200, description: 'Contraseña cambiada exitosamente' })
  @ApiResponse({ status: 400, description: 'Contraseña actual incorrecta' })
  async changePassword(
    @GetUser() user: RequestUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(user.userId, changePasswordDto);
    return { message: 'Contraseña cambiada exitosamente' };
  }

  @Post('forgot-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Solicitar reset de contraseña' })
  @ApiResponse({
    status: 200,
    description: 'Email de reset enviado (si el email existe)',
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto);
    return {
      message:
        'Si el email existe, recibirá un enlace para restablecer su contraseña',
    };
  }

  @Post('reset-password')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resetear contraseña' })
  @ApiResponse({
    status: 200,
    description: 'Contraseña restablecida exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Token inválido o expirado' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);
    return { message: 'Contraseña restablecida exitosamente' };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil del usuario' })
  async getProfile(@GetUser() user: RequestUser) {
    return {
      user: {
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        companyId: user.companyId,
      },
    };
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener sesiones activas del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de sesiones activas' })
  async getSessions(@GetUser() user: RequestUser) {
    const sessions = await this.authService.getUserSessions(user.userId);
    return {
      sessions: sessions.map(session => ({
        id: session.id,
        userAgent: session.userAgent,
        ipAddress: session.ipAddress,
        lastActivityAt: session.lastActivityAt,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
        rememberMe: session.rememberMe,
        isCurrent: session.id === user.sessionId,
      })),
    };
  }

  @Delete('sessions/:sessionId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Terminar una sesión específica' })
  @ApiResponse({ status: 200, description: 'Sesión terminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Sesión no encontrada' })
  async terminateSession(
    @Param('sessionId') sessionId: string,
    @GetUser() user: RequestUser,
  ) {
    const success = await this.authService.terminateSession(
      sessionId,
      user.userId,
    );

    if (!success) {
      return { message: 'Sesión no encontrada o ya terminada' };
    }

    return { message: 'Sesión terminada exitosamente' };
  }
}
