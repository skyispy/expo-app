import { useMutation, useInfiniteQuery } from '@tanstack/react-query';
import { ApiResponse, Board, Comment, CommentCreateRequest, InfiniteQueryResponse } from '../types';
import apiClient from '../api/config';
import { ApiError } from '../errors/ApiError';

// 게시글 목록 조회 (무한 스크롤)
export const useGetBoardList = (category: string, limit?: number, page?: number) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteQuery({
    queryKey: ['boardList', category],
    queryFn: async ({ pageParam }) => {
      const response: ApiResponse<InfiniteQueryResponse<Board>> = await apiClient.get('/board', {
        params: { category, page: pageParam, limit },
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

// 게시글 수정

// 댓글 생성
export const useCreateComment = () => {
  const { mutateAsync } = useMutation({
    mutationFn: async (param: CommentCreateRequest) => {
      const response: ApiResponse<null> = await apiClient.post('/board/comment', param);
      return response.data.result;
    },
    onError: (err) => {
      if(err instanceof ApiError) {
        console.error('useCreateComment -> Failed to create comment', err.message);
      }
    }
  });

  return { createComment: mutateAsync };
}

// 댓글 목록 조회
export const useGetCommentList = (boardId: number) => {
  const { data, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: ['commentList', boardId],
    queryFn: async ({ pageParam }) => {
      const response: ApiResponse<InfiniteQueryResponse<Comment>> = await apiClient.get(`/board/comment`, {
        params: { boardId, page: pageParam, limit: 10 },
      });
      return response.data.result;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const commentList = data?.pages.flatMap(page => page.itemList);

  return { commentList, commentFetchNextPage: fetchNextPage, commentRefetch: refetch };
}