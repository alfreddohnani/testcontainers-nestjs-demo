import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-custom';
import { removeSensitiveData } from '~/common/utils';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'CUSTOM_JWT') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async authenticate(req: Request) {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return this.error(
        new UnauthorizedException('Missing authorization header in request'),
      );
    }

    const token = authorization.split(' ')[1];
    if (!token) {
      return this.error(
        new UnauthorizedException('Missing bearer token in request'),
      );
    }

    try {
      const user = await this.authService.verifyToken(token);
      this.success(removeSensitiveData(user));
    } catch (error) {
      if (error.message === 'jwt expired') {
        return this.error(
          new UnauthorizedException({
            message: 'jwt expired',
            error: 'Unauthorized',
            statusCode: 401,
          }),
        );
      }
      return this.error(new UnauthorizedException(error.message));
    }
  }
}
