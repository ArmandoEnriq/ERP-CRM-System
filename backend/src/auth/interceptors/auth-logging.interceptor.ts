import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { RequestUser } from '../interfaces/auth.interface';

@Injectable()
export class AuthLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuthLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user: RequestUser = request.user;
    const method = request.method;
    const url = request.url;
    const userAgent = request.get('User-Agent') || '';
    const ip = request.ip;

    const userInfo = user
      ? `User: ${user.email} (${user.userId})`
      : 'Anonymous';

    this.logger.log(
      `${method} ${url} - ${userInfo} - IP: ${ip} - UA: ${userAgent}`,
    );

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        this.logger.log(
          `${method} ${url} - ${userInfo} - ${responseTime}ms - SUCCESS`,
        );
      }),
      catchError(error => {
        const responseTime = Date.now() - now;
        this.logger.error(
          `${method} ${url} - ${userInfo} - ${responseTime}ms - ERROR: ${error.message}`,
        );
        throw error;
      }),
    );
  }
}
