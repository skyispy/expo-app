import { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import { useAuthStore } from '@store';
import { ApiResponse, TokenRefreshResponse } from '@types';

interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// accessToken을 SecureStore에서 가져와 Authorization 헤더에 추가
export const addAccessTokenHeader = async (config: InternalAxiosRequestConfig) => {
  const token = await SecureStore.getItemAsync('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// userAgent 생성 후 헤더에 추가
export const addUserAgentHeader = (config: InternalAxiosRequestConfig) => {
  const appName = Application.applicationName ?? 'todo_daily';
  const appVersion = Application.nativeApplicationVersion ?? '1.0.0';
  const deviceId = Device.osInternalBuildId ?? Device.modelId ?? 'unknown-device';
  const platform = Device.osName ?? 'unknown-os';
  config.headers['User-Agent'] = `${appName}/${appVersion} (${platform}; ${deviceId})`;
  return config;
};

// refreshToken으로 토큰 갱신
export const refreshAccessToken = async (error: AxiosError, axiosInstance: AxiosInstance) => {
  const originalRequest = error.config as RetryAxiosRequestConfig;

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    if (refreshToken) {
      try {
        const { data }: ApiResponse<TokenRefreshResponse> = await axiosInstance.post(
          '/auth/refresh',
          {},
          { headers: { 'x-refresh-token': refreshToken } },
        );
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = data.result;
        // 새로운 토큰 저장
        await SecureStore.setItemAsync('accessToken', newAccessToken);
        await SecureStore.setItemAsync('refreshToken', newRefreshToken);
        // 헤더에 새로운 accessToken 설정
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        // 재요청
        return axiosInstance(originalRequest);
      } catch (refreshError: unknown) {
        if (refreshError instanceof AxiosError) {
          if (refreshError.response && refreshError.response.status === 403) {
            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');
            useAuthStore.getState().clearUser();
          }
        }
        return Promise.reject(refreshError);
      }
    } else {
      await SecureStore.deleteItemAsync('accessToken');
      useAuthStore.getState().clearUser();
    }
  }
  return Promise.reject(error);
};
