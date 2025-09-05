import { useMutation } from '@tanstack/react-query';
import { loginUser, loginWithToken, logoutUser } from '../api';
import { LoginRequest } from '../types';
import * as SecureStore from 'expo-secure-store';

export const useLoginUser = () => {
  const { mutateAsync } = useMutation({
    mutationFn: async (param: LoginRequest) => {
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
  });

  return { loginUser: mutateAsync };
};

export const useTokenLoginUser = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      // 토큰으로 로그인 API 호출
      const accessToken = await SecureStore.getItemAsync('accessToken');
      console.log('accessToken', !!accessToken);
      if (accessToken) {
        const data = await loginWithToken();
        if (!data) throw new Error('토큰 로그인에 실패했습니다.');
        // 로그인 성공 시, 토큰 저장
        const { user, accessToken, refreshToken } = data;
        await SecureStore.setItemAsync('accessToken', accessToken);
        if (refreshToken) {
          await SecureStore.setItemAsync('refreshToken', refreshToken);
        }
        return { user };
      }
      return { user: null };
    },
    onError: async (error: Error) => {
      console.error('Token login error:', error.message);
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      return { user: null };
    }
  });

  return { tokenLoginUser: mutate, isTokenLoginPending: isPending };
};

export const useLogoutUser = () => {
  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (refreshToken) {
        const data = await logoutUser(refreshToken);
        // 로그아웃 API 호출
        await Promise.all([
          SecureStore.deleteItemAsync('accessToken'),
          SecureStore.deleteItemAsync('refreshToken'),
        ]);
        return { message: data?.message ?? '로그아웃 되었습니다.' };
      }
      await SecureStore.deleteItemAsync('accessToken');
      return { message: '로그아웃 되었습니다.' };
    },
    onError: async () => {
      await Promise.all([
        SecureStore.deleteItemAsync('accessToken'),
        SecureStore.deleteItemAsync('refreshToken'),
      ]);
      return { message: '로그아웃 되었습니다.' };
    },
  });

  return { logoutUser: mutateAsync };
};
