import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { QueryUsersDto } from './dto/query-users.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { RequestUser } from '../auth/interfaces/auth.interface';
import { ApiAuth } from '../auth/decorators/api-auth.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiAuth({ roles: ['super_admin', 'admin'] })
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 409, description: 'Email ya registrado' })
  async create(
    @Body() createUserDto: CreateUserDto,
    @GetUser() currentUser: RequestUser,
  ) {
    const user = await this.usersService.create(
      createUserDto,
      currentUser.userId,
    );
    return {
      message: 'Usuario creado exitosamente',
      user,
    };
  }

  @Get()
  @ApiAuth({ roles: ['super_admin', 'admin', 'manager'] })
  @ApiOperation({ summary: 'Obtener lista de usuarios con filtros' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  async findAll(@Query() queryDto: QueryUsersDto) {
    return await this.usersService.findWithFilters(queryDto);
  }

  @Get('profile')
  @ApiAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario actual' })
  @ApiResponse({ status: 200, description: 'Perfil del usuario' })
  async getProfile(@GetUser() currentUser: RequestUser) {
    const user = await this.usersService.findById(currentUser.userId);
    return { user };
  }

  @Get('statistics')
  @ApiAuth({ roles: ['super_admin', 'admin'] })
  @ApiOperation({ summary: 'Obtener estadísticas de usuarios' })
  @ApiResponse({ status: 200, description: 'Estadísticas de usuarios' })
  async getStatistics() {
    const statistics = await this.usersService.getStatistics();
    return { statistics };
  }

  @Get('search')
  @ApiAuth()
  @ApiOperation({ summary: 'Buscar usuarios para autocompletado' })
  @ApiResponse({ status: 200, description: 'Usuarios encontrados' })
  async searchForAutocomplete(
    @Query('q') query: string,
    @Query('limit') limit?: number,
  ) {
    const users = await this.usersService.searchForAutocomplete(query, limit);
    return { users };
  }

  @Get(':id')
  @ApiAuth({ roles: ['super_admin', 'admin', 'manager'] })
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.findById(id);
    return { user };
  }

  @Get(':id/subordinates')
  @ApiAuth({ roles: ['super_admin', 'admin', 'manager'] })
  @ApiOperation({ summary: 'Obtener subordinados de un usuario' })
  @ApiResponse({ status: 200, description: 'Lista de subordinados' })
  async getSubordinates(@Param('id', ParseUUIDPipe) id: string) {
    const subordinates = await this.usersService.getSubordinates(id);
    return { subordinates };
  }

  @Patch('profile')
  @ApiAuth()
  @ApiOperation({ summary: 'Actualizar perfil del usuario actual' })
  @ApiResponse({ status: 200, description: 'Perfil actualizado exitosamente' })
  async updateProfile(
    @Body() updateProfileDto: UpdateUserProfileDto,
    @GetUser() currentUser: RequestUser,
  ) {
    const user = await this.usersService.updateProfile(
      currentUser.userId,
      updateProfileDto,
    );
    return {
      message: 'Perfil actualizado exitosamente',
      user,
    };
  }

  @Patch(':id')
  @ApiAuth({ roles: ['super_admin', 'admin'] })
  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() currentUser: RequestUser,
  ) {
    const user = await this.usersService.update(
      id,
      updateUserDto,
      currentUser.userId,
    );
    return {
      message: 'Usuario actualizado exitosamente',
      user,
    };
  }

  @Patch(':id/status')
  @ApiAuth({ roles: ['super_admin', 'admin'] })
  @ApiOperation({ summary: 'Cambiar estado de usuario' })
  @ApiResponse({ status: 200, description: 'Estado cambiado exitosamente' })
  async changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: string,
    @GetUser() currentUser: RequestUser,
  ) {
    const user = await this.usersService.changeStatus(
      id,
      status,
      currentUser.userId,
    );
    return {
      message: 'Estado cambiado exitosamente',
      user,
    };
  }

  @Patch(':id/lock')
  @ApiAuth({ roles: ['super_admin', 'admin'] })
  @ApiOperation({ summary: 'Bloquear/Desbloquear usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario bloqueado/desbloqueado exitosamente',
  })
  async toggleLock(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('isLocked') isLocked: boolean,
    @GetUser() currentUser: RequestUser,
  ) {
    const user = await this.usersService.toggleLock(
      id,
      isLocked,
      currentUser.userId,
    );
    return {
      message: `Usuario ${isLocked ? 'bloqueado' : 'desbloqueado'} exitosamente`,
      user,
    };
  }

  @Patch(':id/reset-password')
  @ApiAuth({ roles: ['super_admin', 'admin'] })
  @ApiOperation({ summary: 'Resetear contraseña de usuario' })
  @ApiResponse({
    status: 200,
    description: 'Contraseña reseteada exitosamente',
  })
  async resetPassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('newPassword') newPassword: string,
    @GetUser() currentUser: RequestUser,
  ) {
    await this.usersService.resetPassword(id, newPassword, currentUser.userId);
    return {
      message: 'Contraseña reseteada exitosamente',
    };
  }

  @Delete(':id')
  @ApiAuth({ roles: ['super_admin', 'admin'] })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar usuario (soft delete)' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() currentUser: RequestUser,
  ) {
    await this.usersService.softDelete(id, currentUser.userId);
    return {
      message: 'Usuario eliminado exitosamente',
    };
  }
}
