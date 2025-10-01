import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from './auth/decorators/public.decorator';
import { AppService } from './app.service';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Obtener información básica de la API' })
  @ApiResponse({ status: 200, description: 'Información de la API' })
  getInfo() {
    return this.appService.getApiInfo();
  }

  @Get('health')
  @Public()
  @ApiOperation({ summary: 'Health check de la API' })
  @ApiResponse({ status: 200, description: 'Estado de salud de la API' })
  getHealth() {
    return this.appService.getHealthCheck();
  }

  @Get('version')
  @Public()
  @ApiOperation({ summary: 'Obtener versión de la API' })
  @ApiResponse({ status: 200, description: 'Versión de la API' })
  getVersion() {
    return this.appService.getVersion();
  }
}
