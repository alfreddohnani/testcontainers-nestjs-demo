import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export class RefreshTokenAuthGuard extends AuthGuard('CUSTOM_REFRESH_TOKEN') {
  getRequest(context: ExecutionContext): any {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest();
    }
  }
}
