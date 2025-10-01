import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { QueryCompaniesDto } from './dto/query-companies.dto';

import { GetUser } from '../auth/decorators/get-user.decorator';
import { RequestUser } from '../auth/interfaces/auth.interface';
import { ApiAuth } from '../auth/decorators/api-auth.decorator';

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ApiAuth({ roles: ['super_admin'] })
  @ApiOperation({ summary: 'Crear una nueva empresa' })
  @ApiResponse({ status: 201, description: 'Empresa creada exitosamente' })
  @ApiResponse({ status: 409, description: 'Nombre o RFC ya existe' })
  async create(
    @Body() createCompanyDto: CreateCompanyDto,
    @GetUser() currentUser: RequestUser,
  ) {
    const company = await this.companiesService.create(
      createCompanyDto,
      currentUser.userId,
    );
    return {
      message: 'Empresa creada exitosamente',
      company,
    };
  }

  @Get()
  @ApiAuth({ roles: ['super_admin', 'admin'] })
  @ApiOperation({ summary: 'Obtener lista de empresas con filtros' })
  @ApiResponse({ status: 200, description: 'Lista de empresas' })
  async findAll(@Query() queryDto: QueryCompaniesDto) {
    return await this.companiesService.findWithFilters(queryDto);
  }

  @Get('statistics')
  @ApiAuth({ roles: ['super_admin'] })
  @ApiOperation({ summary: 'Obtener estadísticas de empresas' })
  @ApiResponse({ status: 200, description: 'Estadísticas de empresas' })
  async getStatistics() {
    const statistics = await this.companiesService.getStatistics();
    return { statistics };
  }

  @Get('expiring-soon')
  @ApiAuth({ roles: ['super_admin'] })
  @ApiOperation({
    summary: 'Obtener empresas con suscripción próxima a vencer',
  })
  @ApiResponse({
    status: 200,
    description: 'Empresas con suscripción próxima a vencer',
  })
  async getExpiringSoon(@Query('days') days?: number) {
    const companies = await this.companiesService.getExpiringSoon(days);
    return { companies };
  }

  @Get('expired')
  @ApiAuth({ roles: ['super_admin'] })
  @ApiOperation({ summary: 'Obtener empresas con suscripción expirada' })
  @ApiResponse({
    status: 200,
    description: 'Empresas con suscripción expirada',
  })
  async getExpired() {
    const companies = await this.companiesService.getExpired();
    return { companies };
  }

  @Get('search')
  @ApiAuth()
  @ApiOperation({ summary: 'Buscar empresas para autocompletado' })
  @ApiResponse({ status: 200, description: 'Empresas encontradas' })
  async searchForAutocomplete(
    @Query('q') query: string,
    @Query('limit') limit?: number,
  ) {
    const companies = await this.companiesService.searchForAutocomplete(
      query,
      limit,
    );
    return { companies };
  }

  @Get('my-company')
  @ApiAuth()
  @ApiOperation({
    summary: 'Obtener información de la empresa del usuario actual',
  })
  @ApiResponse({ status: 200, description: 'Información de la empresa' })
  @ApiResponse({
    status: 404,
    description: 'Usuario no pertenece a ninguna empresa',
  })
  async getMyCompany(@GetUser() currentUser: RequestUser) {
    if (!currentUser.companyId) {
      return {
        message: 'Usuario no pertenece a ninguna empresa',
        company: null,
      };
    }

    const company = await this.companiesService.findById(currentUser.companyId);
    return { company };
  }

  @Get(':id')
  @ApiAuth({ roles: ['super_admin', 'admin'] })
  @ApiOperation({ summary: 'Obtener empresa por ID' })
  @ApiResponse({ status: 200, description: 'Empresa encontrada' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const company = await this.companiesService.findById(id);
    return { company };
  }

  @Get(':id/users-count')
  @ApiAuth({ roles: ['super_admin', 'admin'] })
  @ApiOperation({ summary: 'Obtener cantidad de usuarios de una empresa' })
  @ApiResponse({ status: 200, description: 'Cantidad de usuarios' })
  async getUsersCount(@Param('id', ParseUUIDPipe) id: string) {
    const company = await this.companiesService.findById(id);
    if (!company) {
      return { message: 'Empresa no encontrada' };
    }

    return {
      companyId: id,
      currentUsers: company.currentUsers,
      maxUsers: company.maxUsers,
      availableSlots: company.availableUserSlots,
      canAddMore: company.canAddMoreUsers,
    };
  }

  @Get(':id/can-add-user')
  @ApiAuth({ roles: ['super_admin', 'admin'] })
  @ApiOperation({
    summary: 'Verificar si una empresa puede agregar más usuarios',
  })
  @ApiResponse({ status: 200, description: 'Resultado de la verificación' })
  async canAddUser(@Param('id', ParseUUIDPipe) id: string) {
    const canAdd = await this.companiesService.canAddUser(id);
    return { canAddUser: canAdd };
  }

  @Patch(':id')
  @ApiAuth({ roles: ['super_admin', 'admin'] })
  @ApiOperation({ summary: 'Actualizar empresa' })
  @ApiResponse({ status: 200, description: 'Empresa actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @GetUser() currentUser: RequestUser,
  ) {
    const company = await this.companiesService.update(
      id,
      updateCompanyDto,
      currentUser.userId,
    );
    return {
      message: 'Empresa actualizada exitosamente',
      company,
    };
  }

  @Patch(':id/status')
  @ApiAuth({ roles: ['super_admin'] })
  @ApiOperation({ summary: 'Cambiar estado de empresa' })
  @ApiResponse({ status: 200, description: 'Estado cambiado exitosamente' })
  async changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: string,
    @GetUser() currentUser: RequestUser,
  ) {
    const company = await this.companiesService.changeStatus(
      id,
      status,
      currentUser.userId,
    );
    return {
      message: 'Estado cambiado exitosamente',
      company,
    };
  }

  @Patch(':id/subscription')
  @ApiAuth({ roles: ['super_admin'] })
  @ApiOperation({ summary: 'Renovar suscripción de empresa' })
  @ApiResponse({
    status: 200,
    description: 'Suscripción renovada exitosamente',
  })
  async renewSubscription(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('plan') plan: string,
    @Body('expiresAt') expiresAt: string,
    @GetUser() currentUser: RequestUser,
  ) {
    const company = await this.companiesService.renewSubscription(
      id,
      plan,
      new Date(expiresAt),
      currentUser.userId,
    );
    return {
      message: 'Suscripción renovada exitosamente',
      company,
    };
  }

  @Patch(':id/update-user-count')
  @ApiAuth({ roles: ['super_admin', 'admin'] })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar contador de usuarios de una empresa' })
  @ApiResponse({
    status: 200,
    description: 'Contador actualizado exitosamente',
  })
  async updateUserCount(@Param('id', ParseUUIDPipe) id: string) {
    await this.companiesService.updateUserCount(id);
    return {
      message: 'Contador de usuarios actualizado exitosamente',
    };
  }

  @Delete(':id')
  @ApiAuth({ roles: ['super_admin'] })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar empresa (soft delete)' })
  @ApiResponse({ status: 200, description: 'Empresa eliminada exitosamente' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() currentUser: RequestUser,
  ) {
    await this.companiesService.softDelete(id, currentUser.userId);
    return {
      message: 'Empresa eliminada exitosamente',
    };
  }
}
