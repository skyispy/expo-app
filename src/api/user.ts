import apiClient from './config';
import { ApiResponse, CheckDuplicateNicknameResponse, SignupRequest } from '../types';
import { AxiosError } from 'axios';

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
