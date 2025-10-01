import { useMutation, useInfiniteQuery } from '@tanstack/react-query';
import { ApiResponse, Board, GetBoardListResponse } from '../types';
import apiClient from '../api/config';
import { ApiError } from '../errors/ApiError';

export const useGetBoardList = (category: string, limit?: number, page?: number) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['boardList', category],
    queryFn: async ({ pageParam }) => {
      const response: ApiResponse<GetBoardListResponse> = await apiClient.get('/board', {
        params: { category, page: pageParam, limit },
      });
      return response.data.result;
    },
    initialPageParam: page ?? 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const boardList = data?.pages.flatMap(page => page.boardList);

  return {
    boardList,
    boardFetchNextPage: fetchNextPage,
    boardHasNextPage: hasNextPage,
    boardIsFetchingNextPage: isFetchingNextPage
  };
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