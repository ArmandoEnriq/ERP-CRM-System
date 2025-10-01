import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOptionsWhere,
  ILike,
  MoreThan,
  LessThan,
} from 'typeorm';

import { Company, CompanyStatus } from './entities/company.entity';
import { BaseRepositoryService } from '../database/services/base-repository.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { QueryCompaniesDto } from './dto/query-companies.dto';
import { PaginatedResult } from '../database/interfaces/pagination.interface';

@Injectable()
export class CompaniesService extends BaseRepositoryService<Company> {
  private readonly logger = new Logger(CompaniesService.name);

  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {
    super(companyRepository);
  }

  /**
   * Crear una nueva empresa
   */
  async create(
    createCompanyDto: CreateCompanyDto,
    createdByUserId?: string,
  ): Promise<Company> {
    try {
      // Verificar si el nombre ya existe
      const existingByName = await this.companyRepository.findOne({
        where: { name: createCompanyDto.name },
      });

      if (existingByName) {
        throw new ConflictException('Ya existe una empresa con este nombre');
      }

      // Verificar si el RFC ya existe
      const existingByRfc = await this.companyRepository.findOne({
        where: { rfc: createCompanyDto.rfc },
      });

      if (existingByRfc) {
        throw new ConflictException('Ya existe una empresa con este RFC');
      }

      // Establecer fecha de registro
      const companyData = {
        ...createCompanyDto,
        registeredAt: new Date(),
        currentUsers: 0,
      };

      const company = await super.create(companyData, createdByUserId);

      this.logger.log(
        `Company created: ${company.name} by ${createdByUserId || 'system'}`,
      );

      return company;
    } catch (error) {
      this.logger.error(`Error creating company: ${error.message}`);
      throw error;
    }
  }

  /**
   * Buscar empresas con filtros y paginación
   */
  async findWithFilters(
    queryDto: QueryCompaniesDto,
  ): Promise<PaginatedResult<Company>> {
    try {
      const queryBuilder = this.companyRepository.createQueryBuilder('company');

      // Aplicar filtros base
      queryBuilder.where('company.isActive = :isActive', { isActive: true });

      // Filtro por búsqueda de texto
      if (queryDto.search) {
        queryBuilder.andWhere(
          '(company.name ILIKE :search OR company.tradeName ILIKE :search OR company.rfc ILIKE :search OR company.email ILIKE :search)',
          { search: `%${queryDto.search}%` },
        );
      }

      // Filtros específicos
      if (queryDto.status) {
        queryBuilder.andWhere('company.status = :status', {
          status: queryDto.status,
        });
      }

      if (queryDto.size) {
        queryBuilder.andWhere('company.size = :size', { size: queryDto.size });
      }

      if (queryDto.industry) {
        queryBuilder.andWhere('company.industry ILIKE :industry', {
          industry: `%${queryDto.industry}%`,
        });
      }

      if (queryDto.subscriptionPlan) {
        queryBuilder.andWhere('company.subscriptionPlan = :subscriptionPlan', {
          subscriptionPlan: queryDto.subscriptionPlan,
        });
      }

      if (queryDto.subscriptionActive !== undefined) {
        queryBuilder.andWhere(
          'company.subscriptionActive = :subscriptionActive',
          {
            subscriptionActive: queryDto.subscriptionActive,
          },
        );
      }

      if (queryDto.subscriptionExpired !== undefined) {
        if (queryDto.subscriptionExpired) {
          queryBuilder.andWhere('company.subscriptionExpiresAt < :now', {
            now: new Date(),
          });
        } else {
          queryBuilder.andWhere(
            '(company.subscriptionExpiresAt IS NULL OR company.subscriptionExpiresAt >= :now)',
            { now: new Date() },
          );
        }
      }

      if (queryDto.country) {
        queryBuilder.andWhere('company.country = :country', {
          country: queryDto.country,
        });
      }

      if (queryDto.state) {
        queryBuilder.andWhere('company.state = :state', {
          state: queryDto.state,
        });
      }

      // Incluir conteo de usuarios
      queryBuilder.loadRelationCountAndMap(
        'company.userCount',
        'company.users',
        'users',
        qb => qb.where('users.isActive = :isActive', { isActive: true }),
      );

      // Aplicar ordenamiento
      queryBuilder.orderBy(`company.${queryDto.sortBy}`, queryDto.sortOrder);

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
      this.logger.error(`Error finding companies: ${error.message}`);
      throw error;
    }
  }

  /**
   * Buscar empresa por ID con relaciones
   */
  async findById(id: string): Promise<Company | null> {
    return await this.companyRepository.findOne({
      where: { id, isActive: true },
      relations: ['users'],
    });
  }

  /**
   * Buscar empresa por RFC
   */
  async findByRfc(rfc: string): Promise<Company | null> {
    return await this.companyRepository.findOne({
      where: { rfc, isActive: true },
    });
  }

  /**
   * Actualizar empresa
   */
  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
    updatedByUserId?: string,
  ): Promise<Company> {
    try {
      const company = await this.findById(id);
      if (!company) {
        throw new NotFoundException('Empresa no encontrada');
      }

      // Verificar nombre único si se está cambiando
      if (updateCompanyDto.name && updateCompanyDto.name !== company.name) {
        const existingByName = await this.companyRepository.findOne({
          where: { name: updateCompanyDto.name },
        });
        if (existingByName) {
          throw new ConflictException('Ya existe una empresa con este nombre');
        }
      }

      // Verificar RFC único si se está cambiando
      if (updateCompanyDto.rfc && updateCompanyDto.rfc !== company.rfc) {
        const existingByRfc = await this.companyRepository.findOne({
          where: { rfc: updateCompanyDto.rfc },
        });
        if (existingByRfc) {
          throw new ConflictException('Ya existe una empresa con este RFC');
        }
      }

      const updatedCompany = await super.update(
        id,
        updateCompanyDto,
        updatedByUserId,
      );

      this.logger.log(
        `Company updated: ${id} by ${updatedByUserId || 'system'}`,
      );

      return updatedCompany;
    } catch (error) {
      this.logger.error(`Error updating company ${id}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Cambiar estado de empresa
   */
  async changeStatus(
    id: string,
    status: string,
    updatedByUserId?: string,
  ): Promise<Company> {
    try {
      const company = await this.findById(id);
      if (!company) {
        throw new NotFoundException('Empresa no encontrada');
      }

      // Validar y convertir el status
      const statusEnum = (Object.values(CompanyStatus) as string[]).includes(
        status,
      )
        ? (status as CompanyStatus)
        : null;
      if (!statusEnum) {
        throw new BadRequestException('Estado de empresa inválido');
      }

      const updatedCompany = await super.update(
        id,
        { status: statusEnum },
        updatedByUserId,
      );

      this.logger.log(
        `Company status changed: ${id} to ${status} by ${updatedByUserId || 'system'}`,
      );

      return updatedCompany;
    } catch (error) {
      this.logger.error(
        `Error changing company status ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Actualizar contador de usuarios
   */
  async updateUserCount(companyId: string): Promise<void> {
    try {
      const result = await this.companyRepository
        .createQueryBuilder()
        .update(Company)
        .set({
          currentUsers: () => `(
            SELECT COUNT(*)
            FROM users
            WHERE company_id = '${companyId}' AND is_active = true
          )`,
        })
        .where('id = :id', { id: companyId })
        .execute();

      if (result.affected > 0) {
        this.logger.log(`User count updated for company: ${companyId}`);
      }
    } catch (error) {
      this.logger.error(
        `Error updating user count for company ${companyId}: ${error.message}`,
      );
    }
  }

  /**
   * Verificar si una empresa puede agregar más usuarios
   */
  async canAddUser(companyId: string): Promise<boolean> {
    try {
      const company = await this.findById(companyId);
      if (!company) {
        throw new NotFoundException('Empresa no encontrada');
      }

      return company.canAddMoreUsers;
    } catch (error) {
      this.logger.error(
        `Error checking user limit for company ${companyId}: ${error.message}`,
      );
      return false;
    }
  }

  /**
   * Obtener empresas con suscripción próxima a vencer
   */
  async getExpiringSoon(days: number = 30): Promise<Company[]> {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);

    return await this.companyRepository.find({
      where: {
        isActive: true,
        subscriptionActive: true,
        subscriptionExpiresAt: LessThan(expirationDate),
      },
      order: { subscriptionExpiresAt: 'ASC' },
    });
  }

  /**
   * Obtener empresas con suscripción expirada
   */
  async getExpired(): Promise<Company[]> {
    return await this.companyRepository.find({
      where: {
        isActive: true,
        subscriptionExpiresAt: LessThan(new Date()),
      },
      order: { subscriptionExpiresAt: 'ASC' },
    });
  }

  /**
   * Renovar suscripción
   */
  async renewSubscription(
    id: string,
    plan: string,
    expiresAt: Date,
    updatedByUserId?: string,
  ): Promise<Company> {
    try {
      const company = await this.findById(id);
      if (!company) {
        throw new NotFoundException('Empresa no encontrada');
      }

      const updatedCompany = await super.update(
        id,
        {
          subscriptionPlan: plan,
          subscriptionExpiresAt: expiresAt,
          subscriptionActive: true,
        },
        updatedByUserId,
      );

      this.logger.log(
        `Subscription renewed for company: ${id} by ${updatedByUserId || 'system'}`,
      );

      return updatedCompany;
    } catch (error) {
      this.logger.error(
        `Error renewing subscription for company ${id}: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Obtener estadísticas de empresas
   */
  async getStatistics(): Promise<any> {
    try {
      const [
        totalCompanies,
        activeCompanies,
        trialCompanies,
        suspendedCompanies,
        expiredCompanies,
      ] = await Promise.all([
        this.companyRepository.count({ where: { isActive: true } }),
        this.companyRepository.count({
          where: { isActive: true, status: CompanyStatus.ACTIVE },
        }),
        this.companyRepository.count({
          where: { isActive: true, status: CompanyStatus.TRIAL },
        }),
        this.companyRepository.count({
          where: { isActive: true, status: CompanyStatus.SUSPENDED },
        }),
        this.companyRepository.count({
          where: {
            isActive: true,
            subscriptionExpiresAt: LessThan(new Date()),
          },
        }),
      ]);

      return {
        total: totalCompanies,
        active: activeCompanies,
        trial: trialCompanies,
        suspended: suspendedCompanies,
        expired: expiredCompanies,
        inactive: totalCompanies - activeCompanies,
      };
    } catch (error) {
      this.logger.error(`Error getting company statistics: ${error.message}`);
      throw error;
    }
  }

  /**
   * Buscar empresas para autocompletado
   */
  async searchForAutocomplete(
    query: string,
    limit: number = 10,
  ): Promise<Company[]> {
    return await this.companyRepository.find({
      where: [
        { name: ILike(`%${query}%`), isActive: true },
        { tradeName: ILike(`%${query}%`), isActive: true },
        { rfc: ILike(`%${query}%`), isActive: true },
      ],
      select: ['id', 'name', 'tradeName', 'rfc', 'logo'],
      take: limit,
      order: { name: 'ASC' },
    });
  }

  /**
   * Verificar si un nombre de empresa existe
   */
  async nameExists(name: string, excludeCompanyId?: string): Promise<boolean> {
    const where: FindOptionsWhere<Company> = { name };

    if (excludeCompanyId) {
      where.id = { $ne: excludeCompanyId } as any;
    }

    const count = await this.companyRepository.count({ where });
    return count > 0;
  }

  /**
   * Verificar si un RFC existe
   */
  async rfcExists(rfc: string, excludeCompanyId?: string): Promise<boolean> {
    const where: FindOptionsWhere<Company> = { rfc };

    if (excludeCompanyId) {
      where.id = { $ne: excludeCompanyId } as any;
    }

    const count = await this.companyRepository.count({ where });
    return count > 0;
  }
}
