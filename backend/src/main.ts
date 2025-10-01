import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';

import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

async function bootstrap() {
  // Crear aplicación NestJS
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);

  // Configuración de seguridad
  app.use(
    helmet({
      contentSecurityPolicy: false, // Deshabilitar para desarrollo
      crossOriginEmbedderPolicy: false,
    }),
  );

  // Compresión de respuestas
  app.use(compression());

  // Configuración CORS
  const corsOptions = configService.get('app.cors');
  app.use(cors(corsOptions));

  // Prefijo global para la API
  const globalPrefix = configService.get<string>('app.globalPrefix');
  app.setGlobalPrefix(globalPrefix);

  // Configuración de validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Configuración de archivos estáticos
  app.useStaticAssets('uploads', {
    prefix: '/uploads/',
    maxAge: '1d',
  });

  // Configuración de Swagger
  if (configService.get<boolean>('app.swagger.enabled')) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(configService.get<string>('app.swagger.title'))
      .setDescription(configService.get<string>('app.swagger.description'))
      .setVersion(configService.get<string>('app.swagger.version'))
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingrese su token JWT',
        },
        'JWT',
      )
      .addServer(
        `http://localhost:${configService.get<number>('app.port')}`,
        'Desarrollo',
      )
      .addServer('https://api.erp-crm.com', 'Producción')
      .addTag('System', 'Endpoints del sistema')
      .addTag('Authentication', 'Autenticación y autorización')
      .addTag('Users', 'Gestión de usuarios')
      .addTag('Companies', 'Gestión de empresas')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    const swaggerPath = configService.get<string>('app.swagger.path');

    SwaggerModule.setup(swaggerPath, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
      },
      customSiteTitle: 'ERP/CRM API Documentation',
      customfavIcon: '/favicon.ico',
      customCss: `
        .topbar-wrapper img { content: url('/logo.png'); }
        .swagger-ui .topbar { background-color: #1f2937; }
      `,
    });

    console.log(
      `📚 Swagger UI available at: http://localhost:${configService.get<number>('app.port')}/${swaggerPath}`,
    );
  }

  // Configurar timezone
  process.env.TZ = configService.get<string>('app.timezone');

  // Información de inicio
  const port = configService.get<number>('app.port');
  const environment = configService.get<string>('app.environment');
  const appName = configService.get<string>('app.name');

  await app.listen(port);

  console.log(`
🚀 ${appName} is running!
🌍 Environment: ${environment}
🔗 API URL: http://localhost:${port}/${globalPrefix}
📖 Health Check: http://localhost:${port}/health
⏰ Started at: ${new Date().toLocaleString()}
💾 Memory Usage: ${Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100} MB
  `);

  // Manejo de errores no capturadas
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  process.on('uncaughtException', error => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    await app.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    await app.close();
    process.exit(0);
  });
}

// Inicializar aplicación
bootstrap().catch(error => {
  console.error('Error starting application:', error);
  process.exit(1);
});
