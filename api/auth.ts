import { ApiResponse, LoginRequest, LoginResponse } from '../types';
import apiClient from './config';
import { AxiosError } from 'axios';

// 일반 로그인
export const loginUser = async (param: LoginRequest) => {
  try {
    const response: ApiResponse<LoginResponse> = await apiClient.post('/auth/login', param);
    return response.data;
  } catch(error) {
    if(error instanceof AxiosError) {
      if(error.status === 401 && error.response) {
        throw new Error(error.response.data.message);
      }
      console.error("api/user -> Failed to login user");
      throw new Error("잘못된 요청입니다.");
    }
  }
}

// 토큰으로 로그인
export const loginWithToken = async () => {
  try {
    const response: ApiResponse<LoginResponse> = await apiClient.post('/auth/token-login');
    return response.data;
  } catch(error) {
    if(error instanceof AxiosError) {
      console.error("api/user -> Failed to login with token");
      throw new Error("잘못된 요청입니다.");
    }
  }
}