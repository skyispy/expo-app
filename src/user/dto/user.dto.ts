import { z } from 'zod';
import {
  UserLoginSchema,
  UserProfileUpdateSchema,
  UserResponseSchema,
  UserSignupSchema,
} from './user.schema';

// user 응답 dto
export type UserResponseDto = z.infer<typeof UserResponseSchema>;

// user 회원가입 dto
export type UserSignupDto = z.infer<typeof UserSignupSchema>;

// user 로그인 dto
export type UserLoginDto = z.infer<typeof UserLoginSchema>;

// user 프로필 수정 dto
export type UserProfileUpdateDto = z.infer<typeof UserProfileUpdateSchema>;
