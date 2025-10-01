import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name);

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse() as any;

    let errorResponse;

    if (exceptionResponse.errors && Array.isArray(exceptionResponse.errors)) {
      // Es un error de validación estructurado
      errorResponse = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        error: 'Validation Error',
        message: 'Los datos proporcionados no son válidos',
        validationErrors: exceptionResponse.errors,
      };
    } else {
      // Error de validación simple
      errorResponse = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        error: 'Bad Request',
        message: exceptionResponse.message || exception.message,
      };
    }

    this.logger.warn(
      `Validation Error: ${request.method} ${request.url} - ${JSON.stringify(exceptionResponse)}`,
    );

    response.status(status).json(errorResponse);
  }
}
