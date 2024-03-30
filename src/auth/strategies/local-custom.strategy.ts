import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-custom';
import { AuthService } from '../auth.service';
import { LoginRequestDto } from '../dto/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'CUSTOM_LOCAL') {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async authenticate(req: Request) {
    const { username, password } = req.body as LoginRequestDto;

    if (!username) {
      new BadRequestException('Missing username');
    }
    if (!password) {
      return this.error(new BadRequestException('Missing password'));
    }

    try {
      const payload = await this.authService.validatePassword({
        username,
        password,
      });

      this.success(payload);
    } catch (error) {
      return this.error(
        new HttpException(error.response, error.response.statusCode),
      );
    }
  }
}
