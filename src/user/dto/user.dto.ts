// user 요청 dto
import { RefreshTokensEntity, UserEntity } from '../models';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class UserRequestDto {
  userId: number;
  email: string;
  password: string;
  nickname: string;
  keepLogin: boolean;
  profileImageUrl: string;
  introduction: string;
}

// user 응답 dto
export class UserResponseDto implements Omit<UserEntity, 'password' | 'createAt' | 'updateAt'> {
  @Expose()
  @IsNotEmpty()
  userId: number;

  @Expose()
  email: string;

  @Expose()
  nickname: string;

  @Expose()
  profileImageUrl: string;

  @Expose()
  introduction: string;

  refreshTokens: RefreshTokensEntity[];
}
