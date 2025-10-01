import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getApiInfo() {
    return {
      name: this.configService.get<string>('app.name'),
      description: this.configService.get<string>('app.description'),
      version: this.configService.get<string>('app.version'),
      environment: this.configService.get<string>('app.environment'),
      documentation: `/api/${this.configService.get<string>('app.swagger.path')}`,
      endpoints: {
        auth: '/api/auth',
        users: '/api/users',
        companies: '/api/companies',
      },
    };
  }

  getHealthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: this.configService.get<string>('app.environment'),
      version: this.configService.get<string>('app.version'),
      node_version: process.version,
      memory: {
        used:
          Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) /
          100,
        total:
          Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) /
          100,
      },
    };
  }

  getVersion() {
    return {
      version: this.configService.get<string>('app.version'),
      build: process.env.BUILD_NUMBER || 'development',
      commit: process.env.GIT_COMMIT || 'unknown',
      timestamp: new Date().toISOString(),
    };
  }
}
