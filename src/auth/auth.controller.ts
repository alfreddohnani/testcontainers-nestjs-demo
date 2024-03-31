import {
  Body,
  Controller,
  UseGuards,
  Post,
  Req,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';
import { Request } from 'express';
import { User } from '~/user/entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** Authenticate a user via email/phone and password */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login via email/phone and password' })
  public async login(
    @Body() _body: LoginRequestDto,
    @Req() req: Request,
  ): Promise<LoginResponseDto> {
    const payload = req.user as {
      user: User;
      accessToken: string;
      refreshToken: string;
    };

    return {
      ...payload,
      status: HttpStatus.OK,
      error: null,
    };
  }

  /** Fetch the currently logged in user */
  @UseGuards(JwtAuthGuard)
  @Get('user')
  @ApiOperation({ summary: 'Get logged-in user' })
  async getLoggedInUser(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
