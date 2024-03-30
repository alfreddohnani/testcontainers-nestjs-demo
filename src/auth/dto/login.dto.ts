import { IsNotEmpty, IsString } from 'class-validator';
import { BaseResponseDto } from '~/common/utils/dto/base-response.dto';
import { User } from '~/user/entities/user.entity';

export class LoginRequestDto {
  /** Provide the phone number or email of the user */
  @IsString()
  @IsNotEmpty()
  username: string;

  /** Password of the user */
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginResponseDto extends BaseResponseDto {
  user: User;
  accessToken: string;
  refreshToken: string;
}
