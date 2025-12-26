// 댓글 생성
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { ApiResponse, CommentCreateRequest, InfiniteQueryResponse, Comment } from '@types';
import apiClient from '../api/config';
import { ApiError } from '../errors/ApiError';
import { Alert } from 'react-native';

export const useCreateComment = () => {
  const { mutateAsync } = useMutation({
    mutationFn: async (param: CommentCreateRequest) => {
      const response: ApiResponse<null> = await apiClient.post('/common/comment', param);
      return response.data.result;
    },
    onError: (err) => {
      if (err instanceof ApiError && __DEV__) {
        console.error('useCreateComment -> Failed to create comment', err.message);
      }
    },
  });

  return { createComment: mutateAsync };
};

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
    staleTime: 5 * 60 * 1000,
  });

  const commentList = data?.pages.flatMap((page) => page.itemList);
  const totalCount = data?.pages.flatMap((page) => page.totalCount);

  return {
    commentList,
    commentCount: totalCount,
    commentFetchNextPage: fetchNextPage,
    commentRefetch: refetch,
  };
};

// 댓글 수정
export const useUpdateComment = () => {
  const { mutateAsync } = useMutation({
    mutationFn: async (param: { commentId: number; content: string }) => {
      const response: ApiResponse<null> = await apiClient.put(
        `/common/comment/${param.commentId}`,
        param,
      );
      return response.data.result;
    },
    onError: (err) => {
      if (err instanceof ApiError && __DEV__) {
        console.error('useUpdateComment -> Failed to edit comment', err.message);
      }
    },
  });

  return { updateComment: mutateAsync };
};

// 댓글 삭제
export const useDeleteComment = () => {
  const { mutateAsync } = useMutation({
    mutationFn: async (commentId: number) => {
      const response: ApiResponse<null> = await apiClient.delete(`/common/comment/${commentId}`);
      return response.data.result;
    },
    onSuccess: async () => {
      Alert.alert('댓글 삭제 성공', '댓글이 삭제되었습니다.');
    },
    onError: (err) => {
      if (err instanceof ApiError && __DEV__) {
        console.error('useDeleteComment -> Failed to delete comment', err.message);
      }
      Alert.alert('댓글 삭제 실패', '댓글 삭제에 실패했습니다. 다시 시도해주세요.');
    },
  });

  return { deleteComment: mutateAsync };
};
