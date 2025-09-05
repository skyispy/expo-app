import { z } from 'zod';
import { UserLoginSchema, UserSignupSchema } from '../schemas';
import { User } from './model';

export type ApiResponse<T> = {
  data: T;
  message: string;
  status: number;
};

// 회원가입 요청
export type SignupRequest = Omit<z.infer<typeof UserSignupSchema>, 'confirmPassword'>;
// 닉네임 중복확인 응답
export type CheckDuplicateNicknameResponse = {
  isDuplicate: boolean;
};

// 로그인 요청
export type LoginRequest = z.infer<typeof UserLoginSchema>;
// 로그인 응답
export type LoginResponse = {
  user: User;
  accessToken: string;
  refreshToken?: string;
};

// 로그아웃 응답
export type LogoutResponse = {
  message: string;
};
