import { useMutation, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { ApiResponse, Board, InfiniteQueryResponse } from '@types';
import apiClient from '../api/config';
import { ApiError } from '../errors/ApiError';

// 게시판 목록 조회 (무한 스크롤)
export const useGetBoardList = (categoryId: number, limit?: number, page?: number) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
    queryKey: ['board', { categoryId }],
    queryFn: async ({ pageParam }) => {
      const response: ApiResponse<InfiniteQueryResponse<Board>> = await apiClient.get('/board', {
        params: { categoryId, page: pageParam, limit },
      });
      return response.data.result;
    },
    initialPageParam: page ?? 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const boardList = data?.pages.flatMap(page => page.itemList);

  return {
    boardList,
    boardFetchNextPage: fetchNextPage,
    boardHasNextPage: hasNextPage,
    boardIsFetchingNextPage: isFetchingNextPage,
    boardRefetch: refetch,
  };
}

// 게시글 생성
export const useCreateBoard = () => {
  const { mutateAsync } = useMutation({
    mutationFn: async (param: FormData) => {
      const response: ApiResponse<null> = await apiClient.post('/board', param, {
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

// 게시글 상세 조회
export const useGetBoard = (boardId: number) => {
  const { data, refetch } = useQuery({
    queryKey: ['board', { boardId }],
    queryFn: async () => {
      const response: ApiResponse<Board> = await apiClient.get(`/board/${boardId}`);
      return response.data.result;
    },
    enabled: !!boardId,
  });

  return { board: data, boardRefetch: refetch };
}

// 게시글 수정
export const useUpdateBoard = (boardId: number) => {
  const { mutateAsync } = useMutation({
    mutationFn: async (param: FormData) => {
      const response: ApiResponse<null> = await apiClient.put(`/board/${boardId}`, param, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.result;
    },
    onError: (err) => {
      if(err instanceof ApiError) {
        console.error('useUpdateBoard -> Failed to update board', err.message);
      }
    }
  });

  return { updateBoard: mutateAsync };
}

// 게시글 삭제
export const useDeleteBoard = (boardId: number) => {
  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      const response: ApiResponse<null> = await apiClient.delete(`/board/${boardId}`);
      return response.data.result;
    },
    onError: (err) => {
      if(err instanceof ApiError) {
        console.error('useDeleteBoard -> Failed to delete board', err.message);
      }
    }
  });

  return { deleteBoard: mutateAsync };
}