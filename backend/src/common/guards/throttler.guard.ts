import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard as NestThrottlerGuard } from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ThrottlerGuard extends NestThrottlerGuard {
  constructor(options: any, storageService: any, reflector: Reflector) {
    super(options, storageService, reflector);
  }

  protected async getTracker(req: Record<string, any>): Promise<string> {
    const ip = req.ip || req.connection.remoteAddress;
    const userId = req.user?.userId;
    return userId ? `user:${userId}` : `ip:${ip}`;
  }

  protected generateKey(context: ExecutionContext, tracker: string): string {
    const request = context.switchToHttp().getRequest();
    const route = request.route?.path || request.url;
    const method = request.method;

    // Generar key más específica incluyendo método y ruta
    return `${tracker}:${method}:${route}`;
  }
}
