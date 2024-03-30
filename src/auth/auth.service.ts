import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compareSync } from 'bcrypt';
import { User } from '~/user/entities/user.entity';
import { LoginRequestDto } from './dto/login.dto';
import { where } from 'typeorm-where';
import { removeSensitiveData } from '~/common/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public async validatePassword({
    username,
    password,
  }: LoginRequestDto): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }> {
    if (!username) {
      throw new BadRequestException('Telephone must be provided');
    }

    const user = await User.findOne({
      where: where<User>({
        telephone: { $equal: username },
      }),
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const passwordIsValid = compareSync(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Incorrect password');
    }

    const jwtSecret = this.configService.getOrThrow<string>('JWT_SECRET');
    const accessTokenExpiryTime = this.configService.getOrThrow<string>(
      'ACCESS_TOKEN_EXPIRY_TIME',
    );
    const refreshTokenExpiryTime = this.configService.getOrThrow<string>(
      'REFRESH_TOKEN_EXPIRY_TIME',
    );

    const accessToken = this.jwtService.sign(
      {
        sub: user.id,
        user,
      },
      {
        secret: jwtSecret,
        expiresIn: accessTokenExpiryTime,
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        sub: user.id,
        user,
      },
      {
        secret: jwtSecret,
        expiresIn: refreshTokenExpiryTime,
      },
    );

    return {
      user: removeSensitiveData(user),
      accessToken,
      refreshToken,
    };
  }

  public async getUser({
    telephone,
    id,
  }: {
    telephone?: string;
    id?: string;
  }): Promise<User> {
    if (!(telephone || id)) {
      throw new BadRequestException(
        'Provide one of telephone, or ID of the user',
      );
    }

    const user = await User.findOne({
      where: where<User>([
        { telephone: { $equal: telephone } },
        { id: { $equal: id } },
      ]),
    });

    if (!user) {
      throw new NotFoundException('The user does not exist');
    }

    return user;
  }

  public async verifyToken(token: string): Promise<User> {
    const JWT_SECRET = this.configService.getOrThrow<string>('JWT_SECRET');

    const payload = this.jwtService.verify<{ sub: string; user: User }>(token, {
      secret: JWT_SECRET,
    });

    const user = await this.getUser({ id: payload?.sub });

    if (!user) {
      throw new NotFoundException('The user does not exist');
    }

    return user;
  }
}
