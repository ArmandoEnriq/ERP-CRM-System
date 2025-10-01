import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetSession = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return null;
    }

    return data ? user[data] : user.sessionId;
  },
);
