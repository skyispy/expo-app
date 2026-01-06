// 댓글 생성
import { useQuery, useMutation } from '@tanstack/react-query';
import { ApiResponse, InfiniteQueryResponse, Comment } from '@types';
import apiClient from '../api/config';
import { ApiError } from '../errors/ApiError';
import { Alert } from 'react-native';
import { CommentCreateRequest, CommentUpdateRequest } from '@schemas';

// 댓글 생성
export const useCreateComment = () => {
  const { mutateAsync } = useMutation({
    mutationFn: async (param: CommentCreateRequest) => {
      const response: ApiResponse<null> = await apiClient.post('/comment', param);
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

// 댓글 목록 조회 (페이지네이션 전용)
export const useGetCommentList = ({
  boardId,
  page,
  limit,
}: {
  boardId: number;
  page: number;
  limit: number;
}) => {
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['commentList', { boardId, page }],
    queryFn: async () => {
      const response: ApiResponse<InfiniteQueryResponse<Comment>> = await apiClient.get(
        `/comment`,
        {
          params: { boardId, page, limit },
        },
      );
      return response.data.result;
    },
    enabled: !!boardId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    commentList: data?.itemList || [],
    commentCount: data?.totalCount || 0,
    commentRefetch: refetch,
    isFetching,
    totalPages: data?.totalPages || 0,
  };
};

// 댓글 수정
export const useUpdateComment = () => {
  const { mutateAsync } = useMutation({
    mutationFn: async (param: CommentUpdateRequest) => {
      const response: ApiResponse<null> = await apiClient.put(`/comment/${param.targetCommentId}`, param);
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
      const response: ApiResponse<null> = await apiClient.delete(`/comment/${commentId}`);
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
