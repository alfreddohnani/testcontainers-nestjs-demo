import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '~/user/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): User => {
    if (context.getType() === 'http') {
      const req = context.switchToHttp().getRequest();
      return req.user.user;
    }
  },
);
