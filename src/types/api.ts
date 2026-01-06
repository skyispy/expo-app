import { z } from 'zod';
import { CommentCreateSchema, UserLoginSchema, UserSignupSchema } from '@schemas';
import { User } from './model';

// 범용 API 응답 타입
export type ApiResponse<T> = {
  data: {
    result: T;
    message: string;
    status: number;
  };
};

// 로그인 응답 타입
export type LoginResponse = {
  user: User;
  accessToken: string;
  refreshToken?: string;
};

// 토큰 재발급 응답 타입
export type TokenRefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

// 무한 스크롤 or 페이지네이션 응답 타입
export type InfiniteQueryResponse<T> = {
  itemList: T[];
  nextPage: number | null;
  totalCount: number;
  totalPages?: number;
};
