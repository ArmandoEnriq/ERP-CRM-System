import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { UserStatus, UserRole } from './entities/user.entity';
import { User } from './entities/user.entity';
import { BaseRepositoryService } from '../database/services/base-repository.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { PaginatedResult } from '../database/interfaces/pagination.interface';

@Injectable()
export class UsersService extends BaseRepositoryService<User> {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    super(userRepository);
  }

  /**
   * Crear un nuevo usuario
   */
  async create(
    createUserDto: CreateUserDto,
    createdByUserId?: string,
  ): Promise<User> {
    try {
      // Verificar si el email ya existe
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('El email ya está registrado');
      }

      // Verificar que el supervisor existe si se proporciona
      if (createUserDto.supervisorId) {
        const supervisor = await this.findById(createUserDto.supervisorId);
        if (!supervisor) {
          throw new BadRequestException('El supervisor especificado no existe');
        }
      }

      // Hash de la contraseña
      const saltRounds = this.configService.get<number>(
        'auth.password.saltRounds',
      );
      const hashedPassword = await bcrypt.hash(
        createUserDto.password,
        saltRounds,
      );

      // Crear el usuario
      const userData = {
        ...createUserDto,
        password: hashedPassword,
      };

      const user = await super.create(userData, createdByUserId);

      this.logger.log(
        `User created: ${user.email} by ${createdByUserId || 'system'}`,
      );

      return user;
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`);
      throw error;
    }
  }

  /**
   * Buscar usuarios con filtros y paginación
   */
  async findWithFilters(
    queryDto: QueryUsersDto,
  ): Promise<PaginatedResult<User>> {
    try {
      const queryBuilder = this.userRepository.createQueryBuilder('user');

      // Aplicar filtros base
      queryBuilder.where('user.isActive = :isActive', { isActive: true });

      // Filtro por búsqueda de texto
      if (queryDto.search) {
        queryBuilder.andWhere(
          '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
          { search: `%${queryDto.search}%` },
        );
      }

      // Filtros específicos
      if (queryDto.role) {
        queryBuilder.andWhere('user.role = :role', { role: queryDto.role });
      }

      if (queryDto.status) {
        queryBuilder.andWhere('user.status = :status', {
          status: queryDto.status,
        });
      }

      if (queryDto.companyId) {
        queryBuilder.andWhere('user.companyId = :companyId', {
          companyId: queryDto.companyId,
        });
      }

      if (queryDto.department) {
        queryBuilder.andWhere('user.department = :department', {
          department: queryDto.department,
        });
      }

      if (queryDto.position) {
        queryBuilder.andWhere('user.position ILIKE :position', {
          position: `%${queryDto.position}%`,
        });
      }

      if (queryDto.isEmailVerified !== undefined) {
        queryBuilder.andWhere('user.isEmailVerified = :isEmailVerified', {
          isEmailVerified: queryDto.isEmailVerified,
        });
      }

      if (queryDto.isLocked !== undefined) {
        queryBuilder.andWhere('user.isLocked = :isLocked', {
          isLocked: queryDto.isLocked,
        });
      }

      // Incluir relaciones
      queryBuilder.leftJoinAndSelect('user.company', 'company');
      queryBuilder.leftJoinAndSelect('user.supervisor', 'supervisor');

      // Aplicar ordenamiento
      queryBuilder.orderBy(`user.${queryDto.sortBy}`, queryDto.sortOrder);

      // Aplicar paginación
      const offset = (queryDto.page - 1) * queryDto.limit;
      queryBuilder.skip(offset).take(queryDto.limit);

      const [data, total] = await queryBuilder.getManyAndCount();

      return {
        data,
        meta: {
          total,
          page: queryDto.page,
          limit: queryDto.limit,
          totalPages: Math.ceil(total / queryDto.limit),
          hasNextPage: queryDto.page < Math.ceil(total / queryDto.limit),
          hasPreviousPage: queryDto.page > 1,
          nextPage:
            queryDto.page < Math.ceil(total / queryDto.limit)
              ? queryDto.page + 1
              : undefined,
          previousPage: queryDto.page > 1 ? queryDto.page - 1 : undefined,
        },
      };
    } catch (error) {
      this.logger.error(`Error finding users: ${error.message}`);
      throw error;
    }
  }

  /**
   * Buscar usuario por ID con relaciones
   */
  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id, isActive: true },
      relations: ['company', 'supervisor', 'subordinates'],
    });
  }

  /**
   * Buscar usuario por email
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email, isActive: true },
      relations: ['company'],
    });
  }

  /**
   * Actualizar usuario
   */
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    updatedByUserId?: string,
  ): Promise<User> {
    try {
      const user = await this.findById(id);
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      // Verificar email único si se está cambiando
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = await this.userRepository.findOne({
          where: { email: updateUserDto.email },
        });
        if (existingUser) {
          throw new ConflictException('El email ya está en uso');
        }
      }

      // Verificar supervisor si se está cambiando
      if (
        updateUserDto.supervisorId &&
        updateUserDto.supervisorId !== user.supervisorId
      ) {
        if (updateUserDto.supervisorId === id) {
          throw new BadRequestException(
            'Un usuario no puede ser supervisor de sí mismo',
          );
        }

        const supervisor = await this.findById(updateUserDto.supervisorId);
        if (!supervisor) {
          throw new BadRequestException('El supervisor especificado no existe');
        }
      }

      const updatedUser = await super.update(
        id,
        updateUserDto,
        updatedByUserId,
      );

      this.logger.log(`User updated: ${id} by ${updatedByUserId || 'system'}`);

      return updatedUser;
    } catch (error) {
      this.logger.error(`Error updating user ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Actualizar perfil de usuario (solo campos permitidos)
   */
  async updateProfile(
    id: string,
    updateProfileDto: UpdateUserProfileDto,
  ): Promise<User> {
    try {
      const user = await this.findById(id);
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const updatedUser = await super.update(id, updateProfileDto, id);

      this.logger.log(`User profile updated: ${id}`);

      return updatedUser;
    } catch (error) {
      this.logger.error(`Error updating user profile ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Cambiar estado de usuario
   */
  async changeStatus(
    id: string,
    status: string,
    updatedByUserId?: string,
  ): Promise<User> {
    try {
      const user = await this.findById(id);
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      // Validar y convertir el status a enum
      const statusEnum = (Object.values(UserStatus) as string[]).includes(
        status,
      )
        ? (status as UserStatus)
        : null;
      if (!statusEnum) {
        throw new BadRequestException('Estado de usuario inválido');
      }

      const updatedUser = await super.update(
        id,
        { status: statusEnum },
        updatedByUserId,
      );

      this.logger.log(
        `User status changed: ${id} to ${status} by ${updatedByUserId || 'system'}`,
      );

      return updatedUser;
    } catch (error) {
      this.logger.error(`Error changing user status ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Bloquear/Desbloquear usuario
   */
  async toggleLock(
    id: string,
    isLocked: boolean,
    updatedByUserId?: string,
  ): Promise<User> {
    try {
      const user = await this.findById(id);
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const updateData = {
        isLocked,
        lockExpiresAt: isLocked
          ? new Date(Date.now() + 24 * 60 * 60 * 1000)
          : null, // 24 horas
        loginAttempts: isLocked ? user.loginAttempts : 0,
      };

      const updatedUser = await super.update(id, updateData, updatedByUserId);

      this.logger.log(
        `User ${isLocked ? 'locked' : 'unlocked'}: ${id} by ${updatedByUserId || 'system'}`,
      );

      return updatedUser;
    } catch (error) {
      this.logger.error(`Error toggling user lock ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Resetear contraseña de usuario
   */
  async resetPassword(
    id: string,
    newPassword: string,
    updatedByUserId?: string,
  ): Promise<void> {
    try {
      const user = await this.findById(id);
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const saltRounds = this.configService.get<number>(
        'auth.password.saltRounds',
      );
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      await super.update(
        id,
        {
          password: hashedPassword,
          passwordChangedAt: new Date(),
          mustChangePassword: true,
          loginAttempts: 0,
          isLocked: false,
          lockExpiresAt: null,
        },
        updatedByUserId,
      );

      this.logger.log(
        `Password reset for user: ${id} by ${updatedByUserId || 'system'}`,
      );
    } catch (error) {
      this.logger.error(
        `Error resetting password for user ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Obtener subordinados de un usuario
   */
  async getSubordinates(supervisorId: string): Promise<User[]> {
    return await this.userRepository.find({
      where: { supervisorId, isActive: true },
      relations: ['company'],
      order: { firstName: 'ASC' },
    });
  }

  /**
   * Obtener usuarios por empresa
   */
  async findByCompany(companyId: string): Promise<User[]> {
    return await this.userRepository.find({
      where: { companyId, isActive: true },
      relations: ['supervisor'],
      order: { firstName: 'ASC' },
    });
  }

  /**
   * Obtener estadísticas de usuarios
   */
  async getStatistics(): Promise<any> {
    try {
      const [totalUsers, activeUsers, lockedUsers, pendingUsers, adminUsers] =
        await Promise.all([
          this.userRepository.count({ where: { isActive: true } }),
          this.userRepository.count({
            where: { isActive: true, status: UserStatus.ACTIVE },
          }),
          this.userRepository.count({
            where: { isActive: true, isLocked: true },
          }),
          this.userRepository.count({
            where: { isActive: true, status: UserStatus.PENDING },
          }),
          this.userRepository.count({
            where: { isActive: true, role: UserRole.ADMIN },
          }),
        ]);

      return {
        total: totalUsers,
        active: activeUsers,
        locked: lockedUsers,
        pending: pendingUsers,
        admins: adminUsers,
        inactive: totalUsers - activeUsers,
      };
    } catch (error) {
      this.logger.error(`Error getting user statistics: ${error.message}`);
      throw error;
    }
  }

  /**
   * Verificar si un email existe
   */
  async emailExists(email: string, excludeUserId?: string): Promise<boolean> {
    const where: FindOptionsWhere<User> = { email };

    if (excludeUserId) {
      where.id = { $ne: excludeUserId } as any;
    }

    const count = await this.userRepository.count({ where });
    return count > 0;
  }

  /**
   * Buscar usuarios para autocompletado
   */
  async searchForAutocomplete(
    query: string,
    limit: number = 10,
  ): Promise<User[]> {
    return await this.userRepository.find({
      where: [
        { firstName: ILike(`%${query}%`), isActive: true },
        { lastName: ILike(`%${query}%`), isActive: true },
        { email: ILike(`%${query}%`), isActive: true },
      ],
      select: ['id', 'firstName', 'lastName', 'email', 'avatar'],
      take: limit,
      order: { firstName: 'ASC' },
    });
  }
}
