import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUser } from '../interfaces/auth.interface';

export const GetUser = createParamDecorator(
  (
    data: keyof RequestUser | undefined,
    ctx: ExecutionContext,
  ): RequestUser | any => {
    const request = ctx.switchToHttp().getRequest();
    const user: RequestUser = request.user;

    return data ? user?.[data] : user;
  },
);
