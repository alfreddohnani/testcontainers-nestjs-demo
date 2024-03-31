import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { UserTitle } from '../entities/user.entity';

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
