import { z } from 'zod';
import { UserLoginSchema, UserSignupSchema } from '../schemas';
import { User } from './model';

export type ApiResponse<T> = {
  data: {
    result: T;
    message: string;
    status: number;
  };
};

export type SignupRequest = Omit<z.infer<typeof UserSignupSchema>, 'confirmPassword'>;

export type LoginRequest = z.infer<typeof UserLoginSchema>;

export type LoginResponse = {
  user: User;
  accessToken: string;
  refreshToken?: string;
};

export type LogoutResponse = {
  message: string;
};

export type TokenRefreshResponse = {
  accessToken: string;
  refreshToken: string;
}
