import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import {
  CreateUserRequestDto,
  CreateUserResponseDto,
} from './dto/create-user.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new user' })
  createUser(
    @Body() body: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    return this.userService.createUser(body);
  }
}
