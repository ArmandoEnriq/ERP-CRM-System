/* Lógica principal de autenticación

Login/Logout: Gestión completa de sesiones
Registro: Validación y creación de usuarios
Tokens JWT: Generación y validación
Refresh tokens: Renovación automática
Reset de contraseña: Flujo completo seguro
Control de intentos: Bloqueo automático
Gestión de sesiones: Límites concurrentes */

import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  Logger,
  ConflictException,
} from '@nestjs/common'; // para manejar errores
import { JwtService } from '@nestjs/jwt'; // para manejar JWT
import { ConfigService } from '@nestjs/config'; // para acceder a las variables de entorno
import { InjectRepository } from '@nestjs/typeorm'; // para interactuar con la base de datos
import { Repository, MoreThan } from 'typeorm'; // para realizar consultas
import * as bcrypt from 'bcryptjs'; // para hash de contraseña
import * as crypto from 'crypto'; // para generar tokens seguros

import { User } from '../users/entities/user.entity'; // entidad de usuario
import { UserSession } from './entities/user-session.entity'; // entidad de sesión
import { UserRole } from '../users/entities/user.entity'; // rol de usuario
import { PasswordReset } from './entities/password-reset.entity'; // entidad de reset de contraseña

import { LoginDto } from './dto/login.dto'; // DTO de login
import { RegisterDto } from './dto/register.dto'; // DTO de registro
import { ChangePasswordDto } from './dto/change-password.dto'; // DTO de cambio de contraseña
import { ForgotPasswordDto } from './dto/forgot-password.dto'; // DTO de reset de contraseña
import { ResetPasswordDto } from './dto/reset-password.dto'; // DTO de reset de contraseña

import {
  JwtPayload,
  AuthTokens,
  LoginResponse,
  RequestUser,
} from './interfaces/auth.interface'; // interfaces (debe cumplir la estructura de JwtPayload y RequestUser)

@Injectable() // decorador para indicar que es un servicio inyectable
export class AuthService {
  // clase de servicio
  private readonly logger = new Logger(AuthService.name); // logger de la clase (para mostrar mensajes en la consola de escucha)

  constructor(
    // constructor
    @InjectRepository(User) // inyectar repositorio de usuario
    private userRepository: Repository<User>, // instancia del repositorio
    @InjectRepository(UserSession)
    private sessionRepository: Repository<UserSession>,
    @InjectRepository(PasswordReset)
    private passwordResetRepository: Repository<PasswordReset>,
    private jwtService: JwtService, // instanciamos el servicio de JWT
    private configService: ConfigService, // instanciamos el servicio de configuración
  ) {}

  /**
   * Validar credenciales de usuario (usado por LocalStrategy)
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    // función para validar las credenciales de usuario
    try {
      const user = await this.userRepository.findOne({
        // buscar el usuario en la base de datos usando el email y el isActive
        where: { email, isActive: true },
        relations: ['company'], // incluir la empresa del usuario
      });

      if (!user) {
        return null; // si no se encuentra el usuario, retornar null
      }

      // Verificar si la cuenta está bloqueada
      if (
        user.isLocked &&
        user.lockExpiresAt &&
        user.lockExpiresAt > new Date()
      ) {
        // si la cuenta esta bloqueada y el tiempo de bloqueo no ha expirado y el tiempo de bloqueo es mayor que la fecha actual
        throw new UnauthorizedException(
          `Cuenta bloqueada. Intente nuevamente después de ${user.lockExpiresAt.toLocaleString()}`,
        );
      }

      const isPasswordValid = await bcrypt.compare(password, user.password); // comparar la contraseña ingresada con la contraseña almacenada

      if (!isPasswordValid) {
        // Incrementar intentos fallidos
        await this.handleFailedLogin(user); // llamar a la función para manejar los intentos fallidos
        return null;
      }

      // Reset intentos fallidos en login exitoso sino esta bloqueado
      if (user.loginAttempts > 0) {
        // si el usuario tiene intentos fallidos
        await this.userRepository.update(user.id, {
          // actualizar el usuario en la base de datos
          loginAttempts: 0, // resetear los intentos fallidos
          isLocked: false, // desbloquear la cuenta
          lockExpiresAt: null, // resetear el tiempo de bloqueo
        });
      }

      // Actualizar último login
      await this.userRepository.update(user.id, {
        lastLoginAt: new Date(),
      });

      return user;
    } catch (error) {
      this.logger.error(`Error validating user: ${error.message}`);
      throw error;
    }
  }

  /**
   * Iniciar sesión de usuario
   */
  async login(
    loginDto: LoginDto,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<LoginResponse> {
    try {
      const user = await this.validateUser(loginDto.email, loginDto.password);

      if (!user) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // Verificar si el email está verificado (opcional)
      if (
        !user.isEmailVerified &&
        this.configService.get<boolean>('auth.requireEmailVerification')
      ) {
        throw new UnauthorizedException(
          'Debe verificar su email antes de iniciar sesión',
        );
      }

      // Crear nueva sesión
      const session = await this.createUserSession(
        user,
        loginDto.rememberMe,
        userAgent,
        ipAddress,
      );

      // Generar tokens
      const tokens = await this.generateTokens(user, session.id);

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          companyId: user.companyId,
          isEmailVerified: user.isEmailVerified,
          lastLoginAt: user.lastLoginAt,
        },
        tokens,
        session: {
          id: session.id,
          expiresAt: session.expiresAt,
          rememberMe: session.rememberMe,
        },
      };
    } catch (error) {
      this.logger.error(`Login error for ${loginDto.email}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Registrar nuevo usuario
   */
  async register(registerDto: RegisterDto): Promise<User> {
    try {
      // Verificar si el email ya existe
      const existingUser = await this.userRepository.findOne({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        throw new ConflictException('El email ya está registrado');
      }

      // Hash de la contraseña
      const saltRounds = this.configService.get<number>(
        'auth.password.saltRounds',
      );
      const hashedPassword = await bcrypt.hash(
        registerDto.password,
        saltRounds,
      );

      // Crear usuario
      const user = this.userRepository.create({
        ...registerDto,
        password: hashedPassword,
        role: UserRole.USER, // Role por defecto
        isEmailVerified: false, // Requiere verificación
      });

      const savedUser = await this.userRepository.save(user);

      // TODO: Enviar email de verificación
      this.logger.log(`New user registered: ${savedUser.email}`);

      return savedUser;
    } catch (error) {
      this.logger.error(`Registration error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Cerrar sesión
   */
  async logout(sessionId: string, userId: string): Promise<void> {
    try {
      await this.sessionRepository.update(
        { id: sessionId, userId, isActive: true },
        {
          isActive: false,
          updatedAt: new Date(),
        },
      );

      this.logger.log(
        `User ${userId} logged out, session ${sessionId} deactivated`,
      );
    } catch (error) {
      this.logger.error(`Logout error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Cerrar todas las sesiones de un usuario
   */
  async logoutAll(userId: string): Promise<void> {
    try {
      await this.sessionRepository.update(
        { userId, isActive: true },
        {
          isActive: false,
          updatedAt: new Date(),
        },
      );

      this.logger.log(`All sessions for user ${userId} have been deactivated`);
    } catch (error) {
      this.logger.error(`Logout all error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Refrescar tokens
   */
  async refreshTokens(userId: string, sessionId: string): Promise<AuthTokens> {
    try {
      // Verificar que la sesión sea válida
      const session = await this.sessionRepository.findOne({
        where: {
          id: sessionId,
          userId,
          isActive: true,
          expiresAt: MoreThan(new Date()),
        },
        relations: ['user'],
      });

      if (!session) {
        throw new UnauthorizedException('Sesión inválida o expirada');
      }

      // Actualizar actividad de la sesión
      await this.sessionRepository.update(sessionId, {
        lastActivityAt: new Date(),
      });

      // Generar nuevos tokens
      return await this.generateTokens(session.user, sessionId);
    } catch (error) {
      this.logger.error(`Refresh tokens error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Cambiar contraseña
   */
  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId, isActive: true },
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      // Verificar contraseña actual
      const isCurrentPasswordValid = await bcrypt.compare(
        changePasswordDto.currentPassword,
        user.password,
      );

      if (!isCurrentPasswordValid) {
        throw new BadRequestException('La contraseña actual es incorrecta');
      }

      // Hash de la nueva contraseña
      const saltRounds = this.configService.get<number>(
        'auth.password.saltRounds',
      );
      const hashedNewPassword = await bcrypt.hash(
        changePasswordDto.newPassword,
        saltRounds,
      );

      // Actualizar contraseña
      await this.userRepository.update(userId, {
        password: hashedNewPassword,
        passwordChangedAt: new Date(),
      });

      // Cerrar todas las sesiones excepto la actual (opcional)
      // await this.logoutAll(userId);

      this.logger.log(`Password changed for user ${userId}`);
    } catch (error) {
      this.logger.error(`Change password error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Solicitar reset de contraseña
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: forgotPasswordDto.email, isActive: true },
      });

      if (!user) {
        // No revelar si el email existe o no por seguridad
        this.logger.warn(
          `Password reset requested for non-existent email: ${forgotPasswordDto.email}`,
        );
        return;
      }

      // Invalidar tokens de reset anteriores
      await this.passwordResetRepository.update(
        { userId: user.id, isActive: true },
        { isActive: false },
      );

      // Generar nuevo token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      const passwordReset = this.passwordResetRepository.create({
        token: hashedToken,
        userId: user.id,
        expiresAt: new Date(
          Date.now() +
            this.configService.get<number>(
              'auth.security.passwordResetExpiration',
            ),
        ),
      });

      await this.passwordResetRepository.save(passwordReset);

      // TODO: Enviar email con link de reset
      // await this.emailService.sendPasswordResetEmail(user.email, resetToken);

      this.logger.log(`Password reset requested for user ${user.email}`);
    } catch (error) {
      this.logger.error(`Forgot password error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Reset de contraseña
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    try {
      const hashedToken = crypto
        .createHash('sha256')
        .update(resetPasswordDto.token)
        .digest('hex');

      const passwordReset = await this.passwordResetRepository.findOne({
        where: {
          token: hashedToken,
          isActive: true,
          isUsed: false,
          expiresAt: MoreThan(new Date()),
        },
        relations: ['user'],
      });

      if (!passwordReset) {
        throw new BadRequestException('Token de reset inválido o expirado');
      }

      // Hash de la nueva contraseña
      const saltRounds = this.configService.get<number>(
        'auth.password.saltRounds',
      );
      const hashedNewPassword = await bcrypt.hash(
        resetPasswordDto.newPassword,
        saltRounds,
      );

      // Actualizar contraseña del usuario
      await this.userRepository.update(passwordReset.userId, {
        password: hashedNewPassword,
        passwordChangedAt: new Date(),
      });

      // Marcar token como usado
      await this.passwordResetRepository.update(passwordReset.id, {
        isUsed: true,
        usedAt: new Date(),
        isActive: false,
      });

      // Cerrar todas las sesiones del usuario
      await this.logoutAll(passwordReset.userId);

      this.logger.log(
        `Password reset completed for user ${passwordReset.user.email}`,
      );
    } catch (error) {
      this.logger.error(`Reset password error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validar sesión (usado por JwtStrategy)
   */
  async validateSession(sessionId: string, userId: string): Promise<boolean> {
    try {
      const session = await this.sessionRepository.findOne({
        where: {
          id: sessionId,
          userId,
          isActive: true,
          expiresAt: MoreThan(new Date()),
        },
      });

      if (session) {
        // Actualizar última actividad
        await this.sessionRepository.update(sessionId, {
          lastActivityAt: new Date(),
        });
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error(`Validate session error: ${error.message}`);
      return false;
    }
  }

  /**
   * Validar refresh token
   */
  async validateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    try {
      // Verificar el refresh token usando JWT
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('auth.jwt.refreshSecret'),
      });

      return payload.sub === userId;
    } catch (error) {
      this.logger.error(`Validate refresh token error: ${error.message}`);
      return false;
    }
  }

  /**
   * Obtener sesiones activas del usuario
   */
  async getUserSessions(userId: string): Promise<UserSession[]> {
    return await this.sessionRepository.find({
      where: {
        userId,
        isActive: true,
        expiresAt: MoreThan(new Date()),
      },
      order: { lastActivityAt: 'DESC' },
    });
  }

  /**
   * Terminar una sesión específica
   */
  async terminateSession(sessionId: string, userId: string): Promise<boolean> {
    try {
      const result = await this.sessionRepository.update(
        { id: sessionId, userId, isActive: true },
        { isActive: false },
      );

      return result.affected > 0;
    } catch (error) {
      this.logger.error(`Terminate session error: ${error.message}`);
      return false;
    }
  }

  /**
   * Generar tokens JWT
   */
  private async generateTokens(
    user: User,
    sessionId: string,
  ): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      companyId: user.companyId,
      sessionId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('auth.jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('auth.jwt.refreshExpiresIn'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.getTokenExpirationTime(),
      tokenType: 'Bearer',
    };
  }

  /**
   * Crear sesión de usuario
   */
  private async createUserSession(
    user: User,
    rememberMe: boolean = false,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<UserSession> {
    // Limpiar sesiones expiradas
    await this.cleanupExpiredSessions(user.id);

    // Verificar límite de sesiones concurrentes
    const activeSessions = await this.sessionRepository.count({
      where: {
        userId: user.id,
        isActive: true,
        expiresAt: MoreThan(new Date()),
      },
    });

    const maxConcurrentSessions = this.configService.get<number>(
      'auth.session.maxConcurrentSessions',
    );

    if (activeSessions >= maxConcurrentSessions) {
      // Cerrar la sesión más antigua
      const oldestSession = await this.sessionRepository.findOne({
        where: {
          userId: user.id,
          isActive: true,
        },
        order: { lastActivityAt: 'ASC' },
      });

      if (oldestSession) {
        await this.sessionRepository.update(oldestSession.id, {
          isActive: false,
        });
      }
    }

    const sessionToken = crypto.randomBytes(32).toString('hex');
    const sessionTimeout = this.configService.get<number>(
      'auth.session.sessionTimeout',
    );
    const expirationTime = rememberMe
      ? 30 * 24 * 60 * 60 * 1000
      : sessionTimeout; // 30 días si remember me

    const session = this.sessionRepository.create({
      sessionToken: crypto
        .createHash('sha256')
        .update(sessionToken)
        .digest('hex'),
      userId: user.id,
      userAgent,
      ipAddress,
      lastActivityAt: new Date(),
      expiresAt: new Date(Date.now() + expirationTime),
      rememberMe,
    });

    return await this.sessionRepository.save(session);
  }

  /**
   * Manejar login fallido
   */
  private async handleFailedLogin(user: User): Promise<void> {
    const maxAttempts = this.configService.get<number>(
      'auth.security.maxLoginAttempts',
    );
    const lockoutDuration = this.configService.get<number>(
      'auth.security.lockoutDuration',
    );

    const newAttempts = user.loginAttempts + 1;

    if (newAttempts >= maxAttempts) {
      await this.userRepository.update(user.id, {
        loginAttempts: newAttempts,
        isLocked: true,
        lockExpiresAt: new Date(Date.now() + lockoutDuration),
      });
    } else {
      await this.userRepository.update(user.id, {
        loginAttempts: newAttempts,
      });
    }
  }

  /**
   * Limpiar sesiones expiradas
   */
  private async cleanupExpiredSessions(userId: string): Promise<void> {
    await this.sessionRepository.delete({
      userId,
      expiresAt: MoreThan(new Date()),
    });
  }

  /**
   * Obtener tiempo de expiración del token en segundos
   */
  private getTokenExpirationTime(): number {
    const expiresIn = this.configService.get<string>('auth.jwt.expiresIn');

    // Convertir string como "7d", "24h", "3600s" a segundos
    if (expiresIn.endsWith('d')) {
      return parseInt(expiresIn) * 24 * 60 * 60;
    } else if (expiresIn.endsWith('h')) {
      return parseInt(expiresIn) * 60 * 60;
    } else if (expiresIn.endsWith('m')) {
      return parseInt(expiresIn) * 60;
    } else if (expiresIn.endsWith('s')) {
      return parseInt(expiresIn);
    }

    return 7 * 24 * 60 * 60; // Default: 7 días
  }
}
