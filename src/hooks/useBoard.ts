import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiResponse, Board } from '../types';
import apiClient from '../api/config';
import { ApiError } from '../errors/ApiError';

export const useGetBoards = (category: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['boards', category],
    queryFn: async () => {
      const response: ApiResponse<Board[]> = await apiClient.get('/board', {
        params: { category },
      });
      return response.data.result;
    },
  });

  return { boards: data, isBoardsLoading: isLoading };
}

export const useCreateBoard = () => {
  const { mutateAsync } = useMutation({
    mutationFn: async (param: FormData) => {
      const response: ApiResponse<Board> = await apiClient.post('/board', param, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.result;
    },
    onError: (err) => {
      if(err instanceof ApiError) {
        console.error('useCreateBoard -> Failed to create board', err.message);
      }
    }
  });

  return { createBoard: mutateAsync };
}