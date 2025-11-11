import axios from 'axios';
import { addAccessTokenHeader, addUserAgentHeader, refreshAccessToken } from './interceptors';
import { ApiError } from '../errors/ApiError';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

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
    if (axios.isAxiosError(error)) {
      try {
        // 401 에러 발생 시 토큰 갱신 시도
        return await refreshAccessToken(error, apiClient);
      } catch (err: unknown) {
        // 에러 커스텀 에러로 내보내기
        if(axios.isAxiosError(err)) {
          const message = err.response?.data?.message || err.message;
          const status = err.response?.status;
          const data = err?.response?.data;
          return Promise.reject(new ApiError(message, status, data));
        }
      }
    }

    return Promise.reject(new ApiError("unknown error occurred"));
  },
);

export default apiClient;
