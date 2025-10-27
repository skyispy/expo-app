import { useQuery } from '@tanstack/react-query';
import { ApiResponse, Channel } from '@types';
import apiClient from '../api/config';

// 채널 목록 조회
export const useGetChannelList = () => {
  const { data } = useQuery({
    queryKey: ['channel'],
    queryFn: async () => {
      const response: ApiResponse<Channel[]> = await apiClient.get('/channel');
      return response.data.result;
    },
    staleTime: Infinity,
  });
  return { channelList: data };
}