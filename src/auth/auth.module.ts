import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local-custom.strategy';
import { SessionSerializer } from './serializer.passport';
import { JwtStrategy } from './strategies/jwt-custom.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { User } from '~/user/entities/user.entity';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      signOptions: { expiresIn: '24h' },
    }),
    PassportModule.register({ session: true }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshTokenStrategy,
    SessionSerializer,
  ],
  exports: [JwtModule, TypeOrmModule, AuthService],
})
export class AuthModule {}
