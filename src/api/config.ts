import axios, { AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import { InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// 요청 인터셉터 설정
apiClient.interceptors.request.use(
  async (config) => {
    // accessToken 헤더 추가
    config = await addAccessTokenHeader(config);
    // user-agent 헤더 추가
    config = addUserAgentHeader(config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (error instanceof AxiosError) {
      error = await refreshAccessToken(error);
    }
    return Promise.reject(error);
  },
);

// accessToken을 SecureStore에서 가져와 Authorization 헤더에 추가
async function addAccessTokenHeader(config: InternalAxiosRequestConfig) {
  const token = await SecureStore.getItemAsync('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

// userAgent 생성 후 헤더에 추가
function addUserAgentHeader(config: InternalAxiosRequestConfig) {
  const appName = Application.applicationName ?? 'todo_daily';
  const appVersion = Application.nativeApplicationVersion ?? '1.0.0';
  const deviceId = Device.osInternalBuildId ?? Device.modelId ?? 'unknown-device';
  const platform = Device.osName ?? 'unknown-os';
  config.headers['User-Agent'] = `${appName}/${appVersion} (${platform}; ${deviceId})`;
  return config;
}

// refreshToken으로 토큰 갱신
async function refreshAccessToken(error: AxiosError) {
  const originalRequest = error.config as RetryAxiosRequestConfig;
  if (
    error.response &&
    error.response.status === 401 &&
    originalRequest &&
    !originalRequest._retry
  ) {
    originalRequest._retry = true;
    const refreshToken = await SecureStore.getItemAsync('refreshToken');
    if (refreshToken) {
      try {
        const response = await apiClient.post(
          '/auth/refresh',
          {},
          { headers: { 'x-refresh-token': refreshToken } },
        );
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
        await SecureStore.setItemAsync('accessToken', newAccessToken);
        await SecureStore.setItemAsync('refreshToken', newRefreshToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        if (refreshError instanceof AxiosError) {
          if (refreshError.response && refreshError.response.status === 403) {
            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');
            useAuthStore.getState().clearUser();
            return error;
          }
        }
      }
    }
  }
  return error;
}

export default apiClient;
