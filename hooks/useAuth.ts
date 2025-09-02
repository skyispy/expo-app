import { useMutation } from '@tanstack/react-query';
import { loginUser, loginWithToken } from '../api';
import { LoginRequest } from '../types';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '../store/useAuthStore';

export const useLoginUser = () => {
  const { mutateAsync } = useMutation({
    mutationFn: async(param: LoginRequest) => {
      // 로그인 API 호출
      const data = await loginUser(param);
      if (!data) throw new Error('로그인에 실패했습니다.');

      // 로그인 성공 시, 토큰 저장
      const { user, accessToken, refreshToken } = data;
      await SecureStore.setItemAsync('accessToken', accessToken);
      if (refreshToken) {
        await SecureStore.setItemAsync('refreshToken', refreshToken);
      }
      return { user };
    },
    onSuccess: (data) => {
      useAuthStore.getState().setUser(data.user);
    }
  });

  return { loginUser: mutateAsync };
}

export const useTokenLoginUser = () => {
  const { mutate } = useMutation({
    mutationFn: async() => {
      // 토큰으로 로그인 API 호출
      const data = await loginWithToken();
      if (!data) throw new Error('토큰 로그인에 실패했습니다.');
      // 로그인 성공 시, 토큰 저장
      const { user, accessToken, refreshToken } = data;
      await SecureStore.setItemAsync('accessToken', accessToken);
      if (refreshToken) {
        await SecureStore.setItemAsync('refreshToken', refreshToken);
      }
      return { user };
    },
    onSuccess: (data) => {
      useAuthStore.getState().setUser(data.user);
    }
  });

  return { tokenLoginUser: mutate };
}