import { AppStackScreenProps, Board, Comment, User } from '@types';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { useDeleteBoard } from './useBoard';
import { useQueryClient } from '@tanstack/react-query';
import { useCommentInputStore } from '@store';
import { useDeleteComment } from './useCommon';

export const useBoardMenuOptions = (board: Board | undefined, user: User) => {
  const queryClient = useQueryClient();
  const navigation = useNavigation<AppStackScreenProps>();
  const { deleteBoard } = useDeleteBoard(board?.boardId ?? 0);
  const isAuthor = user.userId === board?.user.userId;
  return isAuthor
    ? [
        {
          label: '게시글 수정',
          icon: 'pencil-outline',
          action: () => {
            navigation.navigate('BoardStep1', { board });
          },
        },
        {
          label: '게시글 삭제',
          icon: 'trash-outline',
          action: () => {
            Alert.alert('게시글 삭제', '정말로 게시글을 삭제하시겠습니까?', [
              { text: '취소', style: 'cancel' },
              {
                text: '삭제',
                style: 'destructive',
                onPress: async () => {
                  await deleteBoard();
                  await queryClient.invalidateQueries({ queryKey: ['board', board?.category] });
                  Alert.alert('게시글 삭제 성공', '게시글이 삭제되었습니다.', [
                    {
                      text: '확인',
                      onPress: async () => {
                        navigation.replace('Main', { screen: 'BoardList' });
                        await queryClient.invalidateQueries({ queryKey: ['board', board?.boardId] });
                      },
                    },
                  ]);
                },
              },
            ]);
          }
        }
      ]
    : [
        {
          label: '신고하기',
          icon: 'flag-outline',
          action: () => console.log(''),
        },
        {
          label: '게시글 공유',
          icon: 'share-social-outline',
          action: () => console.log(''),
        },
        {
          label: '팔로우하기',
          icon: 'person-add-outline',
          action: () => console.log(''),
        },
      ];
}

export const useCommentMenuOptions = (user: User) => {
  const queryClient = useQueryClient();
  const { setMode, setValue, setParentCommentId, setCommentId, setHeaderText } = useCommentInputStore();
    const { deleteComment } = useDeleteComment();
  return (comment: Comment) => {
    const isAuthor = user?.userId === comment.user.userId;
    return isAuthor
      ? [
          {
            label: '댓글 수정',
            icon: 'pencil-outline',
            action: () => {
              setMode('edit');
              setValue(comment.content);
              setCommentId(comment.commentId);
              setHeaderText('댓글 입력');
            },
          },
          {
            label: '댓글 삭제',
            icon: 'trash-outline',
            action: () => {
              Alert.alert('댓글 삭제', '댓글을 삭제하시겠습니까?', [
                {
                  text: '확인',
                  onPress: async () => {
                    await deleteComment(comment.commentId, {
                      onError: (err) => {
                        Alert.alert('댓글 삭제 실패', err.message);
                      }
                    });
                    await queryClient.invalidateQueries({
                      queryKey: ['commentList', { targetType: comment.targetType, targetId: comment.targetId }]
                    });
                  }
                },
                {
                  text: '취소',
                  style: 'cancel',
                }
              ]);
            },
          },
        ]
      : [
          {
            label: '신고하기',
            icon: 'flag-outline',
            action: () => console.log('Report comment'),
          },
          {
            label: '팔로우하기',
            icon: 'person-add-outline',
            action: () => console.log('Follow comment author'),
          },
        ];
  }
}