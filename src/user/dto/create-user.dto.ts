import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { User, UserTitle } from '../entities/user.entity';
import { BaseResponseDto } from '~/common/utils/dto/base-response.dto';

export class CreateUserRequestDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  telephone: string;

  @IsInt()
  @IsPositive()
  age: number;

  @IsEnum(UserTitle)
  title: UserTitle;

  @IsString()
  @MinLength(8)
  password: string;
}

export class CreateUserResponseDto extends BaseResponseDto {
  user: User;
}
