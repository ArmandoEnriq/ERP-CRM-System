import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';

// Pipes
import { ValidationPipe } from './pipes/validation.pipe';
import { ParseUUIDPipe } from './pipes/parse-uuid.pipe';
import { ParseBooleanPipe } from './pipes/parse-boolean.pipe';

// Filters
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ValidationExceptionFilter } from './filters/validation-exception.filter';

// Interceptors
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

// Guards
import { ThrottlerGuard } from './guards/throttler.guard';

// Utils
import { UtilsService } from './services/utils.service';
import { FileService } from './services/file.service';

@Global()
@Module({
  imports: [ConfigModule, CacheModule.register(), ThrottlerModule],
  providers: [
    // Pipes
    ValidationPipe,
    ParseUUIDPipe,
    ParseBooleanPipe,

    // Filters
    HttpExceptionFilter,
    ValidationExceptionFilter,

    // Interceptors
    ResponseInterceptor,
    LoggingInterceptor,

    // Guards
    ThrottlerGuard,

    // Services
    UtilsService,
    FileService,
  ],
  exports: [
    // Pipes
    ValidationPipe,
    ParseUUIDPipe,
    ParseBooleanPipe,

    // Filters
    HttpExceptionFilter,
    ValidationExceptionFilter,

    // Interceptors
    ResponseInterceptor,
    LoggingInterceptor,

    // Guards
    ThrottlerGuard,

    // Services
    UtilsService,
    FileService,
  ],
})
export class CommonModule {}
