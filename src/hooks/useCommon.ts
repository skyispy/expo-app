// 댓글 생성
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { ApiResponse, CommentCreateRequest, InfiniteQueryResponse, Comment } from '@types';
import apiClient from '../api/config';
import { ApiError } from '../errors/ApiError';

export const useCreateComment = () => {
  const { mutateAsync } = useMutation({
    mutationFn: async (param: CommentCreateRequest) => {
      const response: ApiResponse<null> = await apiClient.post('/common/comment', param);
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
export const useGetCommentList = (targetType: string, targetId: number) => {
  const { data, fetchNextPage, refetch } = useInfiniteQuery({
    queryKey: ['commentList', { targetType, targetId }],
    queryFn: async ({ pageParam }) => {
      const response: ApiResponse<InfiniteQueryResponse<Comment>> = await apiClient.get(
        `/common/comment`,
        {
          params: { targetType, targetId, page: pageParam, limit: 10 },
        },
      );
      return response.data.result;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!targetId,
  });

  const commentList = data?.pages.flatMap(page => page.itemList);
  const totalCount = data?.pages.flatMap(page => page.totalCount);

  return { commentList, commentCount: totalCount, commentFetchNextPage: fetchNextPage, commentRefetch: refetch };
}

// 댓글 수정
export const useUpdateComment = (commentId: number) => {
  const { mutateAsync } = useMutation({
    mutationFn: async (param: { content: string }) => {
      const response: ApiResponse<null> = await apiClient.put(`/common/comment/${commentId}`, param);
      return response.data.result;
    },
    onError: (err) => {
      if(err instanceof ApiError) {
        console.error('useUpdateComment -> Failed to edit comment', err.message);
      }
    }
  });

  return { updateComment: mutateAsync };
}

// 댓글 삭제
export const useDeleteComment = () => {
  const { mutateAsync } = useMutation({
    mutationFn: async (commentId: number) => {
      const response: ApiResponse<null> = await apiClient.delete(`/common/comment/${commentId}`);
      return response.data.result;
    },
    onError: (err) => {
      if(err instanceof ApiError) {
        console.error('useDeleteComment -> Failed to delete comment', err.message);
      }
    }
  });

  return { deleteComment: mutateAsync };
}