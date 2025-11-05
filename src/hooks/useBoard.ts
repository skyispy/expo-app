import { useMutation, useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiResponse, Board, InfiniteQueryResponse } from '@types';
import apiClient from '../api/config';
import { ApiError } from '../errors/ApiError';

// 게시글 목록 조회 (무한 스크롤)
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
    staleTime: 5 * 60 * 1000, // 5 minutes
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
      if(err instanceof ApiError && __DEV__) {
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
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { board: data, boardRefetch: refetch };
}

// 게시글 수정
export const useUpdateBoard = () => {
  const { mutateAsync } = useMutation({
    mutationFn: async (param: FormData) => {
      const response: ApiResponse<null> = await apiClient.put(`/board/${param.get('boardId')}`, param, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.result;
    },
    onError: (err) => {
      if(err instanceof ApiError && __DEV__) {
        console.error('useUpdateBoard -> Failed to update board', err.message);
      }
    }
  });

  return { updateBoard: mutateAsync };
}

// 게시글 삭제
export const useDeleteBoard = () => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: async (boardId: number) => {
      const response: ApiResponse<null> = await apiClient.delete(`/board/${boardId}`);
      return response.data.result;
    },
    onSuccess: async (_, boardId) => {
      // 삭제한 게시글 상세 캐시 무효화
      const board = queryClient.getQueryData<Board>(['board', { boardId }]);
      await queryClient.invalidateQueries({ queryKey: ['board', { categoryId: board?.category.categoryId }]})
    },
    onError: (err) => {
      if(err instanceof ApiError && __DEV__) {
        console.error('useDeleteBoard -> Failed to delete board', err.message);
      }
    }
  });

  return { deleteBoard: mutateAsync };
}

// 게시글 좋아요
export const useBoardLike = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: boardLike } = useMutation({
    mutationFn: async ({ boardId, isLiked }: Board) => {
      if(isLiked) {
        // 좋아요 취소
        await apiClient.delete(`/board/${boardId}/action`, { data: { actionType: 'like' } });
      } else {
        // 좋아요 추가
        await apiClient.post(`/board/${boardId}/action`, { actionType: 'like' });
      }
    },
    // Optimistic Update
    onMutate: async ({ boardId, isLiked, category }) => {
      await queryClient.cancelQueries({ queryKey: ['board', { boardId }] });
      const previousBoard = queryClient.getQueryData<Board>(['board', { boardId }]);
      queryClient.setQueryData<Board>(['board', { boardId }], (oldBoard) => {
        if (!oldBoard) return oldBoard;
        return {
          ...oldBoard,
          isLiked: !isLiked,
          likes: isLiked ? oldBoard.likes - 1 : oldBoard.likes + 1,
        };
      });
      // 게시글 목록 캐시도 업데이트
      await queryClient.cancelQueries({ queryKey: ['board', { categoryId: category.categoryId }] });
      const previousBoardList = queryClient.getQueryData<{ pageParams: number[]; pages: InfiniteQueryResponse<Board>[] }>(
        ['board', { categoryId: category.categoryId }]
      );
      queryClient.setQueryData<{ pageParams: number[]; pages: InfiniteQueryResponse<Board>[] }>(
        ['board', { categoryId: category.categoryId }],
        (oldData) => {
          if (!oldData) return oldData;
          const pageIndex = oldData.pages.findIndex(page =>
            page.itemList.some(board => board.boardId === boardId)
          );
          if (pageIndex !== -1) {
            const newPages = [...oldData.pages];
            newPages[pageIndex] = {
              ...newPages[pageIndex],
              itemList: newPages[pageIndex].itemList.map(board =>
                board.boardId === boardId
                  ? { ...board, isLiked: !isLiked, likes: isLiked ? board.likes - 1 : board.likes + 1 }
                  : board
              ),
            };
            return { ...oldData, pages: newPages };
          }
          return oldData;
        }
      );

      return { previousBoard, previousBoardList };
    },
    onError: (err, { boardId }, context) => {
      if (context?.previousBoard) {
        queryClient.setQueryData<Board>(['board', { boardId }], context.previousBoard);
        if (context?.previousBoardList) {
          queryClient.setQueryData<{ pageParams: number[]; pages: InfiniteQueryResponse<Board>[] }>(
            ['board', { categoryId: context.previousBoard.category.categoryId }],
            context.previousBoardList
          );
        }
      }
      if (__DEV__) {
        console.error('useBoardLike -> Failed to update board', err);
      }
    },
  });

  return { boardLike };
};

