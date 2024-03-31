import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateUserRequestDto,
  CreateUserResponseDto,
} from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { where } from 'typeorm-where';
import { hashPassword } from '~/common/utils';

@Injectable()
export class UserService {
  public async createUser(
    dto: CreateUserRequestDto,
  ): Promise<CreateUserResponseDto> {
    const { age, firstName, lastName, password, telephone, title } = dto;
    const existingUser = await User.findOne({
      where: where<User>({ telephone: { $equal: telephone } }),
    });
    if (existingUser) {
      throw new ForbiddenException('The user already exists');
    }

    console.log(existingUser);
    const user = await User.create({
      age,
      firstName,
      lastName,
      password: hashPassword({ plainPassword: password }),
      telephone,
      title,
    }).save();

    return {
      user,
      error: null,
      status: HttpStatus.CREATED,
    };
  }
}
