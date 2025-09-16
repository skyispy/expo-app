import axios from 'axios';
import { addAccessTokenHeader, addUserAgentHeader, refreshAccessToken } from './interceptors';

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
  (error: unknown) => {
    if (error instanceof axios.AxiosError) {
      return refreshAccessToken(error, apiClient);
    }
  },
);

export default apiClient;
