import { ApiResponse, Board, BoardAction, Comment, InfiniteQueryResponse, SortOrder } from '@types';
import { useInfiniteQuery } from '@tanstack/react-query';
import apiClient from '../api/config';

// 행동 기록 조회(게시글)
export const useGetBoardActionList = ({
  userId,
  actionType,
  sortOrder,
}: {
  userId?: number;
  actionType: BoardAction;
  sortOrder: SortOrder;
}) => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery({
      queryKey: userId
        ? ['userBoardAction', { userId, actionType, sortOrder }]
        : ['myBoardAction', { actionType, sortOrder }],
      queryFn: async ({ pageParam }) => {
        const response: ApiResponse<InfiniteQueryResponse<Board & { lastActionDate: Date }>> =
          await apiClient.get(`/action/board/${actionType}`, {
            params: { page: pageParam, limit: 10, sortOrder, targetUserId: userId ?? null },
          });
        return response.data.result;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage,
      staleTime: userId ? 5 * 60 * 1000 : 0, // 사용자 행동 기록은 5분간 신선하게 유지, 내 행동 기록은 기본값 사용
    });

  const boardList = data?.pages.flatMap((page) => page.itemList);

  return {
    boardList: boardList,
    boardActionIsLoading: isLoading,
    boardActionFetchNextPage: fetchNextPage,
    boardActionHasNextPage: hasNextPage,
    boardActionIsFetchingNextPage: isFetchingNextPage,
    boardActionRefetch: refetch,
  };
};

// 내 게시글 조회
export const useGetUserBoardList = ({
  userId,
  sortOrder,
}: {
  userId?: number;
  sortOrder: SortOrder;
}) => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery({
      queryKey: userId ? ['userBoard', { userId, sortOrder }] : ['myBoard', { sortOrder }],
      queryFn: async ({ pageParam }) => {
        const response: ApiResponse<InfiniteQueryResponse<Board>> = await apiClient.get(
          '/action/board',
          {
            params: { page: pageParam, limit: 10, sortOrder, targetUserId: userId ?? null },
          },
        );
        return response.data.result;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage,
      staleTime: userId ? 5 * 60 * 1000 : 0,
    });

  const boardList = data?.pages.flatMap((page) => page.itemList);

  return {
    boardList: boardList,
    userBoardIsLoading: isLoading,
    userBoardFetchNextPage: fetchNextPage,
    userBoardHasNextPage: hasNextPage,
    userBoardIsFetchingNextPage: isFetchingNextPage,
    userBoardRefetch: refetch,
  };
};

// 내 댓글 조회
export const useGetUserCommentList = ({
  userId,
  sortOrder,
}: {
  userId?: number;
  sortOrder: SortOrder;
}) => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useInfiniteQuery({
      queryKey: userId ? ['userComment', { userId, sortOrder }] : ['myComment', { sortOrder }],
      queryFn: async ({ pageParam }) => {
        const response: ApiResponse<InfiniteQueryResponse<Comment & { target: Board }>> =
          await apiClient.get('/action/comment', {
            params: { page: pageParam, limit: 10, sortOrder, targetUserId: userId ?? null },
          });
        return response.data.result;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage,
      staleTime: userId ? 5 * 60 * 1000 : 0,
    });

  const commentList = data?.pages.flatMap((page) => page.itemList);

  return {
    commentList: commentList,
    userCommentIsLoading: isLoading,
    userCommentFetchNextPage: fetchNextPage,
    userCommentHasNextPage: hasNextPage,
    userCommentIsFetchingNextPage: isFetchingNextPage,
    userCommentRefetch: refetch,
  };
};
