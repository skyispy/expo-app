import { ApiResponse, Board, BoardAction, InfiniteQueryResponse, SortOrder } from '@types';
import { useInfiniteQuery } from '@tanstack/react-query';
import apiClient from '../api/config';

// 행동 기록 조회(게시글)
export const useGetBoardActionList = (actionType: BoardAction, sortOrder: SortOrder = 'latest') => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['boardAction', { actionType, sortOrder }],
    queryFn: async ({ pageParam }) => {
      const response: ApiResponse<InfiniteQueryResponse<Board & { lastActionDate: Date }>> =
        await apiClient.get(`/action/board/${actionType}`, {
          params: { page: pageParam, limit: 10, sortOrder },
        });
      return response.data.result;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const boardList = data?.pages.flatMap((page) => page.itemList);

  return {
    boardList: boardList,
    boardActionIsLoading: isLoading,
    boardActionFetchNextPage: fetchNextPage,
    boardActionHasNextPage: hasNextPage,
    boardActionIsFetchingNextPage: isFetchingNextPage,
  };
};

// 내 게시글 조회
export const useGetMyBoardList = (sortOrder: SortOrder = 'latest') => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['myBoard', { sortOrder }],
    queryFn: async ({ pageParam }) => {
      const response: ApiResponse<InfiniteQueryResponse<Board>> = await apiClient.get(
        `/action/me/board`,
        {
          params: { page: pageParam, limit: 10, sortOrder },
        },
      );
      return response.data.result;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const boardList = data?.pages.flatMap(page => page.itemList);

  return {
    boardList: boardList,
    myBoardIsLoading: isLoading,
    myBoardFetchNextPage: fetchNextPage,
    myBoardHasNextPage: hasNextPage,
    myBoardIsFetchingNextPage: isFetchingNextPage,
  }
}


// 내 댓글 조회
export const useGetMyCommentList = (sortOrder: SortOrder = 'latest') => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['myComment', { sortOrder }],
    queryFn: async ({ pageParam }) => {
      const response: ApiResponse<InfiniteQueryResponse<{ board: Board; lastActionDate: Date }>> =
        await apiClient.get(`/action/me/comment`, {
          params: { page: pageParam, limit: 10, sortOrder },
        });
      return response.data.result;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const commentList = data?.pages.flatMap(page => page.itemList);
  return { commentList: commentList, myCommentIsLoading: isLoading }
}