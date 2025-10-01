import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RateLimitInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      tap(() => {
        // Agregar headers de rate limiting a la respuesta
        this.addRateLimitHeaders(request, response);
      }),
    );
  }

  /**
   * Agregar headers informativos sobre rate limiting
   */
  private addRateLimitHeaders(request: any, response: any): void {
    // Estos headers ayudan al cliente a entender su estado de rate limiting
    const remainingRequests =
      response.getHeader('X-RateLimit-Remaining') || 'unknown';
    const resetTime = response.getHeader('X-RateLimit-Reset') || 'unknown';

    if (remainingRequests !== 'unknown') {
      response.setHeader('X-RateLimit-Limit', '100'); // Límite por defecto
      response.setHeader('X-RateLimit-Remaining', remainingRequests);
      response.setHeader('X-RateLimit-Reset', resetTime);
    }

    // Log para monitoreo
    const user = request.user;
    const identifier = user ? `user:${user.userId}` : `ip:${request.ip}`;

    this.logger.debug(
      `Rate limit status for ${identifier}: ${remainingRequests} remaining, resets at ${resetTime}`,
    );
  }
}
