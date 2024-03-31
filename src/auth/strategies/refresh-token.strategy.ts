import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-custom';
import { AuthService } from '../auth.service';
import { removeSensitiveData } from '~/common/utils';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'CUSTOM_REFRESH_TOKEN',
) {
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
      return this.error(new UnauthorizedException(error.message));
    }
  }
}
