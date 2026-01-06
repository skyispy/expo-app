import { useMutation } from '@tanstack/react-query';
import { ApiResponse, LoginResponse } from '@types';
import * as SecureStore from 'expo-secure-store';
import apiClient from '../api/config';
import { ApiError } from '../errors/ApiError';
import { useAuthStore } from '@store';
import { Alert } from 'react-native';
import { LoginRequest } from '@schemas';

export const useLoginUser = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const { mutateAsync } = useMutation({
    mutationFn: async (param: LoginRequest) => {
      // 로그인 API 호출
      const response: ApiResponse<LoginResponse> = await apiClient.post('/auth/login', param);
      if (!response.data.result) throw new Error('로그인에 실패했습니다.');

      // 로그인 성공 시, 토큰 저장
      const { user, accessToken, refreshToken } = response.data.result;
      await SecureStore.setItemAsync('accessToken', accessToken);
      if (refreshToken) {
        await SecureStore.setItemAsync('refreshToken', refreshToken);
      }
      return user;
    },
    onSuccess: (data) => {
      Alert.alert('로그인 성공', `${data.nickname}님 환영합니다!`);
      setUser(data);
    },
    onError: (error: unknown) => {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          Alert.alert('로그인 실패', `${error.message}`);
        } else {
          Alert.alert('로그인 실패', '요청에 실패했습니다. 잠시 후 다시 시도해주세요.');
          console.error('useUser -> Failed to login user', error.message);
        }
      }
    },
  });

  return { loginUser: mutateAsync };
};

export const useTokenLoginUser = () => {
  const { setUser, clearUser } = useAuthStore((state) => state);
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      // 토큰으로 로그인 API 호출
      const accessToken = await SecureStore.getItemAsync('accessToken');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      // 둘 다 없으면 바로 로그아웃 처리
      if (!accessToken && !refreshToken) {
        clearUser();
        return;
      }
      const response: ApiResponse<LoginResponse> = await apiClient.post('/auth/token-login');
      if (!response.data.result) throw new Error('로그아웃 되었습니다.');
      // 로그인 성공 시, 토큰 저장
      const {
        user,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      } = response.data.result;
      await SecureStore.setItemAsync('accessToken', newAccessToken);
      if (newRefreshToken) {
        await SecureStore.setItemAsync('refreshToken', newRefreshToken);
      }
      setUser(user);
    },
    onError: async (error: unknown) => {
      if (error instanceof ApiError) {
        if (error.status === 403) {
          // refreshToken이 유효하지 않은 경우
          clearUser();
          return;
        }
        console.error('useUser -> Failed to login with token', error.message);
      }
      // 토큰이 유효하지 않거나, 기타 오류 시 토큰 삭제
      await SecureStore.deleteItemAsync('accessToken');
      clearUser();
    },
  });

  return { tokenLoginUser: mutate, isTokenLoginPending: isPending };
};

export const useLogoutUser = () => {
  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (refreshToken) {
        // 로그아웃 API 호출
        const response: ApiResponse<null> = await apiClient.post(
          '/auth/logout',
          {},
          {
            headers: { 'x-refresh-token': refreshToken },
          },
        );
        await Promise.all([
          SecureStore.deleteItemAsync('accessToken'),
          SecureStore.deleteItemAsync('refreshToken'),
        ]);
        return { message: response.data.message };
      }
      await SecureStore.deleteItemAsync('accessToken');
      return { message: '로그아웃 되었습니다.' };
    },
    onSuccess: (data) => {
      Alert.alert(
        '로그아웃',
        data.message,
        [
          {
            text: '확인',
            onPress: () => useAuthStore.getState().clearUser(),
          },
        ],
        { cancelable: false },
      );
    },
    onError: async (error: unknown) => {
      if (error instanceof ApiError) {
        console.error('useUser -> Failed to logout user', error.message);
        await Promise.all([
          SecureStore.deleteItemAsync('accessToken'),
          SecureStore.deleteItemAsync('refreshToken'),
        ]);
        return { message: '로그아웃 되었습니다.' };
      }
    },
  });

  return { logoutUser: mutateAsync };
};
