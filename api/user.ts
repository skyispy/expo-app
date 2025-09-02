import apiClient from './config';
import { SignupRequest } from '../types';
import  { AxiosError } from 'axios';

export const signupUser = async(param: SignupRequest) => {
  try {
    const response = await apiClient.post('/user/signup', param);
    return response.data;
  } catch(error) {
    if(error instanceof AxiosError) {
      if(error.status === 400 && error.response) {
        throw new Error(error.response.data.message);
      }
      console.error("api/user -> Failed to signup user");
      throw new Error("잘못된 요청입니다.");
    }
  }
}