import apiClient from './config';
import {
  ApiResponse,
  CheckDuplicateNicknameResponse,
  SignupRequest,
  UpdateProfileResponse,
} from '../types';
import { AxiosError } from 'axios';

// 회원가입
export const signupUser = async (param: SignupRequest) => {
  try {
    const response = await apiClient.post('/user/signup', param);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.status === 409 && error.response) {
        throw new Error(error.response.data.message);
      }
      console.error('api/user -> Failed to signup user');
      throw new Error('요청에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  }
};

// 닉네임 중복확인
export const checkDuplicateNickname = async (nickname: string) => {
  try {
    const response: ApiResponse<CheckDuplicateNicknameResponse> = await apiClient.get(
      '/user/check-nickname',
      {
        params: { nickname },
      },
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('api/user -> Failed to check duplicate nickname');
      throw new Error('요청에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  }
};

// 프로필 수정
export const updateProfile = async (param: FormData) => {
  try {
    const response: ApiResponse<UpdateProfileResponse> = await apiClient.put('/user/profile', param, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.log(error)
    if (error instanceof AxiosError) {
      if (error.status === 409 && error.response) {
        throw new Error(error.response.data.message);
      }
      console.error('api/user -> Failed to update profile', error.message);
      throw new Error('요청에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  }
}